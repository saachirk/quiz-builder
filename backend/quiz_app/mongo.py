from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["quiz_db"]

users_collection = db["users"]
quiz_collection = db["quizzes"]
result_collection = db["results"]

