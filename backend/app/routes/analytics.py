from fastapi import APIRouter
from ..database import wallet_collection

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_summary():

    total = wallet_collection.count_documents({})

    high_count = wallet_collection.count_documents({"risk_level": "HIGH"})
    medium_count = wallet_collection.count_documents({"risk_level": "MEDIUM"})
    low_count = wallet_collection.count_documents({"risk_level": "LOW"})

    avg_risk_cursor = wallet_collection.aggregate([
        {"$group": {"_id": None, "avgRisk": {"$avg": "$risk_score"}}}
    ])

    avg_latency_cursor = wallet_collection.aggregate([
        {"$group": {"_id": None, "avgLatency": {"$avg": "$inference_time_ms"}}}
    ])

    avg_risk_list = list(avg_risk_cursor)
    avg_latency_list = list(avg_latency_cursor)

    avg_risk = avg_risk_list[0]["avgRisk"] if avg_risk_list else 0
    avg_latency = avg_latency_list[0]["avgLatency"] if avg_latency_list else 0

    latest = list(
        wallet_collection.find()
        .sort("timestamp", -1)
        .limit(5)
    )

    for doc in latest:
        doc["_id"] = str(doc["_id"])

    return {
        "total_wallets_analyzed": total,
        "risk_distribution": {
            "HIGH": high_count,
            "MEDIUM": medium_count,
            "LOW": low_count
        },
        "average_risk_score": round(avg_risk, 2),
        "average_inference_latency_ms": round(avg_latency, 2),
        "latest_wallets": latest
    }


@router.get("/top-risk")
def get_top_risk_wallets():
    wallets = list(
        wallet_collection.find()
        .sort("risk_score", -1)
        .limit(3)
    )

    for wallet in wallets:
        wallet["_id"] = str(wallet["_id"])

    return wallets
@router.get("/risk-trend")
def get_risk_trend():
    wallets = list(
        wallet_collection.find()
        .sort("timestamp", -1)
        .limit(10)
    )

    wallets.reverse()

    return [
        {
            "timestamp": str(w["timestamp"]),
            "risk_score": w["risk_score"]
        }
        for w in wallets
    ]
