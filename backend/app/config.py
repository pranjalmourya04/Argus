import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=env_path)

class Settings:
    RPC_URL = os.getenv("RPC_URL")
    PRIVATE_KEY = os.getenv("PRIVATE_KEY")
    CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
    MONGO_URI = os.getenv("MONGO_URI")

settings = Settings()
