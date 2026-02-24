from fastapi import APIRouter
from datetime import datetime
from web3 import Web3
from pydantic import BaseModel
import time
from ..websocket_manager import manager
import json

from ..blockchain import contract, w3, account
from ..database import wallet_collection
from ..ai.scoring import generate_risk_score
from ..config import settings

router = APIRouter()


# -------------------------------
# Request Model
# -------------------------------
class WalletRequest(BaseModel):
    wallet: str


# -------------------------------
# Response Model
# -------------------------------
class AnalyzeResponse(BaseModel):
    wallet: str
    risk_score: int
    risk_level: str
    explanations: list[str]
    inference_time_ms: float
    total_request_time_ms: float
    tx_hash: str | None
    block_number: int | None
    confirmation_status: str


# -------------------------------
# Analyze Endpoint
# -------------------------------
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_wallet(request: WalletRequest):

    start_time = time.time()

    # Separate ML + Blockchain representations
    wallet_input = request.wallet
    wallet_ml = wallet_input.lower()
    wallet_checksum = Web3.to_checksum_address(wallet_input)

    # -------------------------------
    # AI Inference (lowercase)
    # -------------------------------
    risk_score, risk_level, features, explanations, inference_time_ms = generate_risk_score(wallet_ml)

    # -------------------------------
    # Blockchain Interaction (checksum)
    # -------------------------------
    tx_hash = None
    block_number = None
    confirmation_status = "NOT_EXECUTED"

    try:
        nonce = w3.eth.get_transaction_count(account.address)

        tx = contract.functions.flagWallet(
            wallet_checksum,
            risk_score
        ).build_transaction({
            "from": account.address,
            "nonce": nonce,
            "gas": 200000,
            "gasPrice": w3.to_wei("10", "gwei"),
            "chainId": 11155111  # Sepolia
        })

        signed_tx = w3.eth.account.sign_transaction(tx, settings.PRIVATE_KEY)
        sent_tx = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(sent_tx)

        tx_hash = sent_tx.hex()
        block_number = receipt.blockNumber
        confirmation_status = "SUCCESS" if receipt.status == 1 else "FAILED"

    except Exception as e:
        print("BLOCKCHAIN ERROR:", str(e))
        confirmation_status = "BLOCKCHAIN_FAILED"

    # -------------------------------
    # Total Request Time
    # -------------------------------
    total_request_time_ms = (time.time() - start_time) * 1000

    # -------------------------------
    # Store in MongoDB (lowercase)
    # -------------------------------
    wallet_collection.insert_one({
        "wallet": wallet_ml,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "features": features,
        "explanations": explanations,
        "inference_time_ms": inference_time_ms,
        "total_request_time_ms": total_request_time_ms,
        "tx_hash": tx_hash,
        "block_number": block_number,
        "confirmation_status": confirmation_status,
        "timestamp": datetime.utcnow(),
        "model_version": "v4_real_onchain_iso_forest"
    })

    # WebSocket alert
    alert_data = {
        "wallet": wallet_ml,
        "risk_score": risk_score,
        "risk_level": risk_level
    }

    await manager.broadcast(json.dumps(alert_data))

    # Debug wallet balance
    print("Backend wallet:", account.address)
    print("Balance:", w3.from_wei(w3.eth.get_balance(account.address), "ether"))

    # -------------------------------
    # Response
    # -------------------------------
    return {
        "wallet": wallet_ml,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "explanations": explanations,
        "inference_time_ms": inference_time_ms,
        "total_request_time_ms": total_request_time_ms,
        "tx_hash": tx_hash,
        "block_number": block_number,
        "confirmation_status": confirmation_status
    }
