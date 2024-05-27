//
//  AptosHelper.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import Foundation
import AptosKit

class AptosHelper {
    var aptosClient: RestClient!
    var account: Account!
    
    func initialize() async throws {
        aptosClient = try await RestClient(baseUrl: "https://rpc.ankr.com/http/aptos_testnet/v1")
    }
    
    func generateAptosAccount(privateKey: String) throws {
        let bytes = Data.init(hex: privateKey).bytes.prefix(32)
        
        self.account = try Account.loadKey(Data(bytes).hexString)
    }
    
    
    func signMessage(message: String) throws -> String {
        guard let data = message.data(using: .utf8) else {
            return "Invalid message"
        }
        
        let signature: Signature = try account.sign(data)
        return signature.description
    }
    
    func getBalance() async throws -> String {
        let balance = try await aptosClient.accountBalance(account.accountAddress)
        print(account.accountAddress.description)
        return (Double(balance) / Double(100_000_000)).description
    }
    
    func airdropFaucet() async throws {
        let faucetClient = FaucetClient(baseUrl: "https://faucet.testnet.aptoslabs.com", restClient: aptosClient)
        try await faucetClient.fundAccount(account.accountAddress.description, 100_000_000)
    }
    
    func selfTransfer() async throws -> String {
        let payload: [String: Any] = [
            "type": "entry_function_payload",
            "function": "0x1::aptos_account::transfer",
            "type_arguments": [],
            "arguments": [
                "\(account.accountAddress.description)",
                "\(100000)"
            ]
        ]
        
        return try await aptosClient.submitTransaction(account, payload)
    }
    
}
