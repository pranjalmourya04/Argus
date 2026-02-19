// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FraudRegistry {
    event WalletFlagged(address wallet, uint256 riskScore, uint256 timestamp);
    mapping(address => uint256) public walletRisk;

    function flagWallet(address _wallet, uint256 _riskScore) external {
        walletRisk[_wallet] = _riskScore;
        emit WalletFlagged(_wallet, _riskScore, block.timestamp);
    }
}
