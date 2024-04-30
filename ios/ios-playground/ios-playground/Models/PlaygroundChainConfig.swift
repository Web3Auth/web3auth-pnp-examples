//
//  PlaygroundChainConfig.swift
//  ios-playground
//
//  Created by Ayush B on 26/04/24.
//

import Foundation
import Web3Auth

struct PlaygroundChainConfig: Codable, Hashable {
    public let chainNamespace: ChainNamespace
    public let decimals: Int
    public let blockExplorerUrl: String
    public let chainId: String
    public let displayName: String
//    public let logo: String
    public let rpcTarget: String
    public let ticker: String
    public let tickerName: String
}
