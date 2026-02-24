import csv
import requests
from web3 import Web3
import numpy as np
from app.config import settings
from app.services.onchain_features import get_wallet_graph
from app.ai.features import extract_graph_features

# -----------------------------------
# CONFIG
# -----------------------------------
OUTPUT_FILE = "real_wallet_dataset.csv"
ETHERSCAN_URL = "https://api.etherscan.io/v2/api"


# -----------------------------------
# Fetch Recent Wallets from Blocks
# -----------------------------------
def fetch_recent_wallets(limit=600):
    wallets = set()

    # Get latest block
    params = {
        "chainid": "1",
        "module": "proxy",
        "action": "eth_blockNumber",
        "apikey": settings.ETHERSCAN_API_KEY,
    }

    response = requests.get(ETHERSCAN_URL, params=params)
    latest_block = int(response.json()["result"], 16)

    print("Latest Block:", latest_block)

    # Sample blocks across wider range
    block_ranges = [
        (latest_block, latest_block - 50),
        (latest_block - 5000, latest_block - 5050),
        (latest_block - 50000, latest_block - 50050),
    ]

    for start, end in block_ranges:
        for block_num in range(start, end, -1):

            params = {
                "chainid": "1",
                "module": "proxy",
                "action": "eth_getBlockByNumber",
                "tag": hex(block_num),
                "boolean": "true",
                "apikey": settings.ETHERSCAN_API_KEY,
            }

            block_response = requests.get(ETHERSCAN_URL, params=params).json()
            block = block_response.get("result", {})
            transactions = block.get("transactions", [])

            for tx in transactions:
                if tx.get("from"):
                    wallets.add(tx["from"])
                if tx.get("to"):
                    wallets.add(tx["to"])

            if len(wallets) >= limit:
                break

        if len(wallets) >= limit:
            break

    print("Collected Wallets:", len(wallets))
    return list(wallets)[:limit]


# -----------------------------------
# Simple Heuristic Labeling
# -----------------------------------
def heuristic_label(features):
    if (
        features["incoming_outgoing_ratio"] > 3
        or features["unique_counterparties"] < 3
        or features["total_volume"] > 10000
    ):
        return 1  # suspicious
    return 0  # normal


# -----------------------------------
# Build Dataset
# -----------------------------------
def build_dataset(wallets):
    rows = []
    feature_list = []

    # First pass: collect features only
    for wallet in wallets:
        try:
            wallet = wallet.lower()
            print("Processing:", wallet)

            G = get_wallet_graph(wallet)

            if G.number_of_nodes() <= 1:
                continue

            features = extract_graph_features(G, wallet)
            feature_list.append(features)

        except Exception as e:
            print("Error:", e)

    # Convert to numpy arrays for percentile calculation
    volumes = np.array([f["total_volume"] for f in feature_list])
    diversity = np.array([f["unique_counterparties"] for f in feature_list])
    ratio = np.array([f["incoming_outgoing_ratio"] for f in feature_list])

    volume_threshold = np.percentile(volumes, 90)
    diversity_threshold = np.percentile(diversity, 10)
    ratio_threshold = np.percentile(ratio, 90)

    print("Volume threshold:", volume_threshold)
    print("Diversity threshold:", diversity_threshold)
    print("Ratio threshold:", ratio_threshold)

    # Second pass: label based on distribution
    for f in feature_list:

        label = 0

        if (
            f["total_volume"] > volume_threshold
            or f["unique_counterparties"] < diversity_threshold
            or f["incoming_outgoing_ratio"] > ratio_threshold
        ):
            label = 1

        row = [
            f["total_transactions"],
            f["unique_counterparties"],
            f["incoming_count"],
            f["outgoing_count"],
            f["incoming_outgoing_ratio"],
            f["total_volume"],
            f["degree_centrality"],
            # f["clustering_coefficient"],
            label,
        ]

        rows.append(row)

    return rows


# -----------------------------------
# Save CSV
# -----------------------------------
def save_to_csv(rows):
    header = [
        "total_transactions",
        "unique_counterparties",
        "incoming_count",
        "outgoing_count",
        "incoming_outgoing_ratio",
        "total_volume",
        "degree_centrality",
        # "clustering_coefficient",
        "label",
    ]

    with open(OUTPUT_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

    print("Dataset saved to", OUTPUT_FILE)
    print("Total rows:", len(rows))


# -----------------------------------
# MAIN
# -----------------------------------
if __name__ == "__main__":
    wallets = fetch_recent_wallets(limit=600)
    dataset = build_dataset(wallets)
    save_to_csv(dataset)