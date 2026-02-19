import certifi
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where()
)
print("Mongo Ping:", client.admin.command("ping"))
db = client["argus_db"]
wallet_collection = db["wallets"]
