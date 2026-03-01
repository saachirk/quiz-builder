from pymongo import MongoClient

# --- Local MongoDB ---
local_client = MongoClient("mongodb://localhost:27017/")
local_db = local_client["quiz_db"]

# --- Atlas MongoDB ---
atlas_uri = "mongodb+srv://saachirkattics24_db_user:GF9rCuZbWwAy2PGU@quiz.lkuciey.mongodb.net/?retryWrites=true&w=majority"
atlas_client = MongoClient(atlas_uri)
atlas_db = atlas_client["quiz_db"]

# --- Fetch all users from local DB ---
users = list(local_db["users"].find())

if users:
    # Remove '_id' so Atlas generates new ObjectIds
    for user in users:
        user.pop("_id", None)

    # Insert into Atlas
    atlas_db["users"].insert_many(users)
    print(f"Migrated {len(users)} users to Atlas successfully!")
else:
    print("No users found in local DB.")
