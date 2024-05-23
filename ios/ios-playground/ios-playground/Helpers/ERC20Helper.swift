//
//  ERC20Helper.swift
//  ios-playground
//
//  Created by Ayush B on 29/04/24.
//

import BigInt
import Foundation
import web3

public enum ERC20Helper {
    public struct balanceOf: ABIFunction {
        public static let name = "balanceOf"
        public let gasPrice: BigUInt?
        public let gasLimit: BigUInt?
        public var contract: EthereumAddress
        public let from: EthereumAddress?

        public let account: EthereumAddress

        public init(
            contract: EthereumAddress,
            from: EthereumAddress? = nil,
            gasPrice: BigUInt? = nil,
            gasLimit: BigUInt? = nil,
            account: EthereumAddress
        ) {
            self.contract = contract
            self.from = from
            self.gasPrice = gasPrice
            self.gasLimit = gasLimit
            self.account = account
        }

        public func encode(to encoder: ABIFunctionEncoder) throws {
            try encoder.encode(account)
        }
    }

    public struct approve: ABIFunction {
        public static let name = "approve"
        public let gasPrice: BigUInt?
        public let gasLimit: BigUInt?
        public var contract: EthereumAddress
        public let from: EthereumAddress?

        public let spender: EthereumAddress
        public let value: BigUInt

        public init(
            contract: EthereumAddress,
            from: EthereumAddress? = nil,
            gasPrice: BigUInt? = nil,
            gasLimit: BigUInt? = nil,
            spender: EthereumAddress,
            value: BigUInt
        ) {
            self.contract = contract
            self.from = from
            self.gasPrice = gasPrice
            self.gasLimit = gasLimit
            self.spender = spender
            self.value = value
        }

        public func encode(to encoder: ABIFunctionEncoder) throws {
            try encoder.encode(spender)
            try encoder.encode(value)
        }
    }
    
    public struct balanceResponse: ABIResponse, MulticallDecodableResponse {
        public static var types: [ABIType.Type] = [BigUInt.self]
        public let value: BigUInt

        public init?(values: [ABIDecoder.DecodedValue]) throws {
            self.value = try values[0].decoded()
        }
    }
}
