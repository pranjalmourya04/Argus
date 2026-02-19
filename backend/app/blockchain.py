from web3 import Web3
from .config import settings

w3 = Web3(Web3.HTTPProvider(settings.RPC_URL))

contract_address = Web3.to_checksum_address(settings.CONTRACT_ADDRESS)

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

account = w3.eth.account.from_key(settings.PRIVATE_KEY)
