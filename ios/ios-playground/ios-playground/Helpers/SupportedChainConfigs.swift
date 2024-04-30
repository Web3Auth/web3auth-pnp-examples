//
//  PlaygroundChainConfig.swift
//  ios-playground
//
//  Created by Ayush B on 26/04/24.
//

import Foundation
import Web3Auth

let chainConfigs = [
    PlaygroundChainConfig(
        chainNamespace: ChainNamespace.eip155,
        decimals: 18,
        blockExplorerUrl: "https://sepolia.etherscan.io/",
        chainId: "11155111",
        displayName: "Ethereum Sepolia", 
        rpcTarget: "https://1rpc.io/sepolia",
        ticker: "ETH", 
        tickerName: "Ethereum"
    ),
    PlaygroundChainConfig(
        chainNamespace: ChainNamespace.eip155,
        decimals: 18,
        blockExplorerUrl: "https://sepolia.etherscan.io/",
        chainId: "421614",
        displayName: "Arbitrum Sepolia",
        rpcTarget: "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
        ticker: "ETH",
        tickerName: "Ethereum"
    )
    
]
