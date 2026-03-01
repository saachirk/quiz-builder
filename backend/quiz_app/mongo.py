import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("URI"))

db = client["quiz_db"]

users_collection = db["users"]
quiz_collection = db["quizzes"]
result_collection = db["results"]
