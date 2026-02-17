from django.shortcuts import render
import json
import bcrypt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .mongo import users_collection

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")
        role = data.get("role")

        #password match confirm password
        if password != confirm_password:
            return JsonResponse({"error" : "Passwords do not match"},status = 400)
        
        #to check if email exists
        if users_collection.find_one({"email" : email}):
            return JsonResponse({"error" : "Email already exists"},status = 400)
        
        #hashed password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())

        users_collection.insert_one({
            "name" : name,
            "email" : email,
            "password" : hashed_password,
            "role" : role
        })

        return JsonResponse({"message": "User registered successfully"}, status=201)
        

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

