import requests
import networkx as nx
from app.config import settings

ETHERSCAN_URL = "https://api.etherscan.io/v2/api"


def fetch_transactions(wallet: str):
    params = {
        "chainid": "1",
        "module": "account",
        "action": "txlist",
        "address": wallet,
        "startblock": "0",
        "endblock": "99999999",
        "page": "1",
        "offset": "500",
        "sort": "desc",
        "apikey": settings.ETHERSCAN_API_KEY,
    }

    response = requests.get(ETHERSCAN_URL, params=params)

    print("STATUS CODE:", response.status_code)
    print("RAW RESPONSE TEXT:", response.text[:500])

    data = response.json()

    if data.get("status") != "1":
        print("API ERROR OBJECT:", data)
        return []

    return data["result"]


def build_transaction_graph(wallet: str, transactions: list):
    G = nx.DiGraph()
    wallet = wallet.lower() 
    G.add_node(wallet)

    for tx in transactions:
        from_addr = tx["from"]
        to_addr = tx["to"]

        # convert wei to ETH float
        value = int(tx["value"]) / 10**18

        if from_addr and to_addr:
            G.add_edge(from_addr, to_addr, value=value)

    return G

def get_wallet_graph(wallet: str):
    txs = fetch_transactions(wallet)
    G = build_transaction_graph(wallet, txs)   
    return G



