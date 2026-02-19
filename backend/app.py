from fastapi import FastAPI, Body
from web3 import Web3
import os
import random
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

load_dotenv()
print("Loaded contract:", os.getenv("CONTRACT_ADDRESS"))


app = FastAPI()

w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))

contract_address = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))

abi = [
    {
        "anonymous": False,
        "inputs": [
            {"indexed": False, "internalType": "address", "name": "wallet", "type": "address"},
            {"indexed": False, "internalType": "uint256", "name": "riskScore", "type": "uint256"},
            {"indexed": False, "internalType": "uint256", "name": "timestamp", "type": "uint256"},
        ],
        "name": "WalletFlagged",
        "type": "event",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "_wallet", "type": "address"},
            {"internalType": "uint256", "name": "_riskScore", "type": "uint256"},
        ],
        "name": "flagWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
]

contract = w3.eth.contract(address=contract_address, abi=abi)
private_key = os.getenv("PRIVATE_KEY")

if not private_key:
    raise Exception("PRIVATE_KEY not found in .env")

account = w3.eth.account.from_key(private_key)
print("Backend wallet address:", account.address)

mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise Exception("MONGO_URI not found in .env")

mongo_client = MongoClient(mongo_uri)
db = mongo_client["argus_db"]
wallet_collection = db["wallet_risks"]

print("MongoDB connected successfully")

def generate_risk_score(wallet: str):
    score = random.randint(0, 100)

    if score > 70:
        level = "HIGH"
    elif score > 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return score, level

@app.get("/")
def read_root():
    return {"message": "ARGUS backend running"}

@app.post("/flag")
def flag_wallet(
    wallet: str = Body(...),
    risk_score: int = Body(...)
):
    try:
        wallet = Web3.to_checksum_address(wallet)

        nonce = w3.eth.get_transaction_count(account.address)

        tx = contract.functions.flagWallet(
            wallet,
            risk_score
        ).build_transaction({
            "from": account.address,
            "nonce": nonce,
            "gas": 200000,
            "gasPrice": w3.to_wei("10", "gwei"),
            "chainId": 11155111
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return {
            "status": "Transaction sent",
            "tx_hash": tx_hash.hex()
        }

    except Exception as e:
        return {"error": str(e)}

@app.post("/analyze")
def analyze_wallet(wallet: str = Body(...)):
    try:
        wallet = Web3.to_checksum_address(wallet)

        risk_score, risk_level = generate_risk_score(wallet)

        nonce = w3.eth.get_transaction_count(account.address)

        tx = contract.functions.flagWallet(
            wallet,
            risk_score
        ).build_transaction({
            "from": account.address,
            "nonce": nonce,
            "gas": 200000,
            "gasPrice": w3.to_wei("10", "gwei"),
            "chainId": 11155111
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        wallet_collection.insert_one({
    "wallet": wallet,
    "risk_score": risk_score,
    "risk_level": risk_level,
    "tx_hash": tx_hash.hex(),
    "timestamp": datetime.utcnow(),
    "model_version": "v1_random_baseline"
})


        return {
            "wallet": wallet,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "tx_hash": tx_hash.hex()
        }

    except Exception as e:
        return {"error": str(e)}
