from django.shortcuts import render
import json
import bcrypt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .mongo import users_collection
import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .hugginface_service import generate_quiz
from datetime import datetime
import uuid
from bson import ObjectId
from .mongo import get_db, sessions_collection, quiz_collection, result_collection  # assuming you have mongo.py setup

logger = logging.getLogger(__name__)

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            name = data.get("name")
            email = data.get("email")
            password = data.get("password")
            confirm_password = data.get("confirmPassword")
            role = data.get("role")

            # Check if required fields are present
            if not all([name, email, password, confirm_password, role]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            #password match confirm password
            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)
            
            #to check if email exists
            if users_collection.find_one({"email": email}):
                return JsonResponse({"error": "Email already exists"}, status=400)
            
            #hashed password
            hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

            # Insert user into MongoDB
            result = users_collection.insert_one({
                "name": name,
                "email": email,
                "password": hashed_password,
                "role": role
            })

            logger.info(f"User registered successfully: {email}, ID: {result.inserted_id}")

            return JsonResponse({"message": "User registered successfully", "user": {"name": name, "email": email, "role": role}}, status=201)
        
        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body")
            return JsonResponse({"error": "Invalid request data"}, status=400)
        except Exception as e:
            logger.error(f"Error during registration: {str(e)}")
            return JsonResponse({"error": f"Registration failed: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)
        

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        user = users_collection.find_one({"email" : email})

        if not user:
            return JsonResponse({"error" : "User not found"},status = 404)
        
        if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            return JsonResponse({"error": "Invalid password"}, status=401)
        
        return JsonResponse({
            "message" : "Login Successful",
            "user" : {
                "name" : user["name"],
                "email" : user["email"],
                "role" : user["role"]
            }
        })
    

@api_view(["POST"])
def generate_quiz_view(request):
    try:
        topic = request.data.get("topic")
        number_of_questions = request.data.get("numberOfQuestions")
        difficulty = request.data.get("difficulty")

        print("Received:", topic, number_of_questions, difficulty)

        if not topic or not number_of_questions:
            return Response({"error": "Missing fields"}, status=400)

        # Convert to integer
        number_of_questions = int(number_of_questions)

        quiz = generate_quiz(topic, number_of_questions, difficulty)

        if not quiz:
            return Response({"error": "Quiz generation failed"}, status=500)

        db = get_db()
        quiz_collection = db["quizzes"]

        result = quiz_collection.insert_one({
            "topic": topic,
            "difficulty": difficulty,
            "questions": quiz
        })

        return Response({
            "quizId": str(result.inserted_id),
            "questions": quiz
        })

    except Exception as e:
        print("ERROR IN GENERATE QUIZ VIEW:", str(e))
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def start_quiz(request):
    try:
        session_id = str(uuid.uuid4())
        data = request.data
        quiz_id = data.get("quizId")
        topic = data.get("topic")
        duration = 600  # 10 minutes total
        session_doc = {
            "session_id": session_id,
            "quiz_id": quiz_id,
            "topic": topic,
            "start_time": datetime.utcnow().isoformat(),
            "switches": 0,
            "duration": duration,
            "expired": False
        }
        sessions_collection.insert_one(session_doc)
        return Response({
            "session_id": session_id,
            "duration": duration
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def get_time_left(request):
    try:
        data = request.data
        session_id = data.get("session_id")
        session = sessions_collection.find_one({"session_id": session_id})
        if not session:
            return Response({"error": "Session not found"}, status=404)
        start_time_str = session["start_time"]
        if start_time_str.endswith('Z'):
            start_time_str = start_time_str[:-1] + '+00:00'
        start_time = datetime.fromisoformat(start_time_str)
        elapsed = (datetime.utcnow() - start_time).total_seconds()
        time_left = max(0, session["duration"] - elapsed)
        expired = time_left <= 0 or session["switches"] >= 5
        return Response({
            "time_left": int(time_left),
            "expired": expired,
            "switches": session["switches"]
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def report_switch(request):
    try:
        data = request.data
        session_id = data.get("session_id")
        result = sessions_collection.find_one_and_update(
            {"session_id": session_id},
            {"$inc": {"switches": 1}},
            return_document=True
        )
        if not result:
            return Response({"error": "Session not found"}, status=404)
        if result["switches"] >= 5:
            return Response({"expired": True})
        return Response({"switches": result["switches"]})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def submit_quiz(request):
    try:
        data = request.data
        session_id = data.get("session_id")
        answers = data.get("answers", [])
        session = sessions_collection.find_one({"session_id": session_id})
        if not session:
            return Response({"error": "Session not found"}, status=404)
        # Validate time/switches
        start_time_str = session["start_time"]
        if start_time_str.endswith('Z'):
            start_time_str = start_time_str[:-1] + '+00:00'
        start_time = datetime.fromisoformat(start_time_str)
        elapsed = (datetime.utcnow() - start_time).total_seconds()
        time_left = session["duration"] - elapsed
        if time_left <= 0 or session["switches"] >= 5:
            return Response({"error": "Time up or too many tab switches"}, status=403)
        # Get quiz
        quiz_id = session["quiz_id"]
        quiz_doc = quiz_collection.find_one({"_id": ObjectId(quiz_id)})
        if not quiz_doc:
            return Response({"error": "Quiz not found"}, status=404)
        questions = quiz_doc["questions"]
        # Score server-side
        score = 0
        total = len(questions)
        for i in range(total):
            if i < len(answers) and answers[i] == questions[i]["correctAnswer"]:
                score += 1
        # Save result
        result_doc = {
            "session_id": session_id,
            "quiz_id": quiz_id,
            "score": score,
            "total": total,
            "answers": answers,
            "submit_elapsed": elapsed,
            "switches": session["switches"]
        }
        result_collection.insert_one(result_doc)
        # Mark expired
        sessions_collection.update_one({"session_id": session_id}, {"$set": {"expired": True}})
        return Response({
            "score": score,
            "total": total,
            "topic": session["topic"],
            "switches": session["switches"]
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)
