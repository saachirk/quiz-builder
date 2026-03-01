from django.shortcuts import render
import json
import bcrypt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .mongo import users_collection
import logging

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

            return JsonResponse({"message": "User registered successfully"}, status=201)
        
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

