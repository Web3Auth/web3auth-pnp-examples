package com.example.android_playground.utils

import com.web3auth.core.types.ChainConfig
import com.web3auth.core.types.ChainNamespace


val chainConfigList = arrayOf(
    ChainConfig(
        chainNamespace = ChainNamespace.EIP155,
        decimals = 18,
        blockExplorerUrl = "https://sepolia.etherscan.io/",
        chainId = "11155111",
        displayName = "Ethereum Sepolia",
        rpcTarget = "https://1rpc.io/sepolia",
        ticker = "ETH",
        tickerName = "Ethereum"
    ),
    ChainConfig(
        chainNamespace = ChainNamespace.EIP155,
        decimals = 18,
        blockExplorerUrl = "https://sepolia.etherscan.io/",
        chainId = "421614",
        displayName = "Arbitrum Sepolia",
        rpcTarget = "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
        ticker = "ETH",
        tickerName = "Ethereum"
    )
)