//
//  SolanaViewModel.swift
//  ios-solana-example
//
//  Created by Ayush B on 26/02/24.
//

import Foundation
import SolanaSwift

class SolanaViewModel: ObservableObject {
    private var solanaJSONRPCClient: JSONRPCAPIClient!
    private var blockchainClient: BlockchainClient!
    var keyPair: KeyPair!
    var balance: String!
    
    @Published var isAccountLoaded: Bool = false
    
    
    func initialize(privateKey: String) {
        let endpoint = APIEndPoint(
            address: "https://api.devnet.solana.com",
            network: .devnet
        )
        
        solanaJSONRPCClient = JSONRPCAPIClient(endpoint: endpoint)
        blockchainClient = BlockchainClient(apiClient: solanaJSONRPCClient)
        
        Task {
            do {
                try generateKeyPair(privateKey: privateKey)
                self.balance = try await fetchUserBalance()
                
                DispatchQueue.main.async {
                    self.isAccountLoaded = true
                }
                
            } catch let error {
                print(error)
            }
        }
        
    }
    
    private func reloadBalance() {
        DispatchQueue.main.async {
            self.isAccountLoaded = false
        }
        
        Task {
            do {
                self.balance = try await fetchUserBalance()
                
                DispatchQueue.main.async {
                    self.isAccountLoaded = true
                }
                
            } catch let error {
                print(error)
            }
        }
    }
    
    func selfTransferSol(onSend: @escaping (String?, Error?) -> ()) {
        Task {
            do {
                let transaction = try await perpareTransaction()
                let hash = try await blockchainClient.sendTransaction(preparedTransaction: transaction)
                reloadBalance()
                onSend(hash, nil)
                
                
            } catch let error {
                print(error)
                onSend(nil, error)
            }
        }
    }
    
    func signSelfTransferSol(onSign: @escaping (String?, Error?) -> ()) {
        Task {
            do {
                var transaction = try await perpareTransaction()
                try transaction.sign()
                let signature = try transaction.findSignature(publicKey: keyPair.publicKey)
                onSign(signature, nil)
            } catch let error {
                print(error)
                onSign(nil, error)
            }
        }
    }
    
    private func perpareTransaction() async throws -> PreparedTransaction {
        let transaction = try await blockchainClient.prepareSendingNativeSOL(
            from: keyPair,
            to: "2idRaWFin4Zn5WY9or6XBhcoF6cyfDWSbJQ26jAtptxD",
            amount: 0.01.toLamport(decimals: 9)
        )
        
        return transaction
    }
    
    
    func generateKeyPair(privateKey: String) throws {
        
        keyPair = try KeyPair(secretKey: Data(hex: privateKey))
    }
    
    func fetchUserBalance() async throws -> String {
        let balance = try await solanaJSONRPCClient.getBalance(
            account: keyPair.publicKey.base58EncodedString
        )
        
        return balance.convertToBalance(decimals: 9).description
    }
}
