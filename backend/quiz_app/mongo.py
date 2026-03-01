import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("mongodb+srv://saachirkattics24_db_user:GF9rCuZbWwAy2PGU@quiz.lkuciey.mongodb.net/?appName=Quiz"))

db = client["quiz_db"]

users_collection = db["users"]
quiz_collection = db["quizzes"]
result_collection = db["results"]
