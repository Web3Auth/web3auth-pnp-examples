//
//  EVMHelper.swift
//  ios-playground
//
//  Created by Ayush B on 25/04/24.
//

import Foundation
import web3
import Web3Auth
import BigInt

class EthereumHelper {
    private var ethereumAccount: EthereumAccount!
    private var client: EthereumHttpClient!
    private var chainId: Int!
    
    func setUp(web3AuthState: Web3AuthState, rpcUrl: String, chainId: Int) throws {
        self.ethereumAccount = try EthereumAccount.init(keyStorage: web3AuthState as EthereumSingleKeyStorageProtocol)
        self.client = EthereumHttpClient(url: URL.init(string: rpcUrl)!, network: .custom(chainId.description))
        self.chainId = chainId
    }
    
    func address() -> String {
        return ethereumAccount.address.toChecksumAddress()
    }
    
    func getBalance() async throws -> String {
        let balance = try await client.eth_getBalance(address: ethereumAccount.address, block: .Latest)
        return Web3AuthUtils.toEther(wei: balance).description
    }
    
    func signMessage(message: String) async throws -> String {
        guard let data = message.data(using: .ascii) else {
            throw PlaygroundError.decodingError
        }
        let signature = try ethereumAccount.signMessage(message: data)
        return signature
    }
    
    func sendTransaction(value: String, to: String) async throws -> String {
        let weiValue = Web3AuthUtils.toWei(ether: Ether(floatLiteral: Double(value)!))
        let nonce = try await getNonce()
        let gasPrice = try await getGasPrice()
        let ethereumTransaction = EthereumTransaction(
            from: ethereumAccount.address,
            to: EthereumAddress.init(stringLiteral: to),
            value: weiValue,
            data: Data(),
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: nil,
            chainId: chainId
        )
        
        return try await broadcastTransaction(ethereumTransaction: ethereumTransaction)
    }
    
    private func getNonce() async throws -> Int {
        let nonce = try await client.eth_getTransactionCount(address: ethereumAccount.address, block: .Latest)
        return nonce
    }
    
    private func getGasPrice() async throws -> BigUInt {
        return try await client.eth_gasPrice()
    }
    
    private func estimateGas(ethereumTransaction: EthereumTransaction) async throws -> BigUInt {
        return try await client.eth_estimateGas(ethereumTransaction)
    }
    
    private func broadcastTransaction(ethereumTransaction: EthereumTransaction) async throws -> String {
        let gas = try await estimateGas(ethereumTransaction: ethereumTransaction)
        let transaction = EthereumTransaction(
            
            from: ethereumTransaction.from,
            to:ethereumTransaction.to,
            value: ethereumTransaction.value,
            data: ethereumTransaction.data,
            nonce: ethereumTransaction.nonce,
            gasPrice: ethereumTransaction.gasPrice,
            gasLimit: gas,
            chainId: ethereumTransaction.chainId
        )
        
        let hash = try await client.eth_sendRawTransaction(transaction, withAccount: ethereumAccount)
        return hash
    }
    
    func balanceOf(contractAddress: String) async throws -> String {
        let function = ERC20Helper.balanceOf(
            contract: EthereumAddress(contractAddress),
            account: ethereumAccount.address
        )
        
        let balanceResponse = try await function.call(
            withClient: client,
            responseType: ERC20Helper.balanceResponse.self
        )
        
        return balanceResponse.value.description
    }
    
    func revokeApproval(contractAddress: String, spenderAddress: String) async throws -> String {
        let contract = EthereumAddress(contractAddress)
        let spender = EthereumAddress(spenderAddress)
        let gasPrice = try await getGasPrice()
        
        let tryCall = ERC20Helper.approve(
            contract: contract,
            from: ethereumAccount.address,
            gasPrice: gasPrice,
            spender: spender,
            value: BigUInt.zero
        )
        
        let subdata = try tryCall.transaction()
        let gas = try await client.eth_estimateGas(subdata)
        
        
        let function = ERC20Helper.approve(
            contract: contract,
            from: ethereumAccount.address,
            gasPrice: gasPrice,
            gasLimit: gas,
            spender: spender,
            value: BigUInt.zero
        )
        
        let data = try function.transaction()
        let hash = try await broadcastTransaction(ethereumTransaction: data)
        return hash
    }
}


extension Web3AuthState: EthereumSingleKeyStorageProtocol {
    public func storePrivateKey(key: Data) throws {
        
    }
    
    public func loadPrivateKey() throws -> Data {
        guard let data = self.privKey?.web3.hexData else {
            throw PlaygroundError.decodingError
        }
        
        return data
    }
}
