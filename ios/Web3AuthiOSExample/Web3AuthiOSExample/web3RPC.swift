
import BigInt
import Combine
import Foundation
import web3
import Web3Auth
import SwiftUI

class Web3RPC : ObservableObject {
    var user: Web3AuthState
    private var client: EthereumClientProtocol
    public var address: EthereumAddress
    private var account: EthereumAccount
    private var latestBlock = 0
    private var chainID = 5
    private var RPC_URL = "https://rpc.ankr.com/eth_goerli"
    
    @Published var balance: Double = 0
    @Published var signedMessageHashString:String = ""
    @Published var sentTransactionID:String = ""
    @Published var publicAddress: String = ""
    
    init?(user: Web3AuthState){
        self.user = user
        do{
            client = EthereumClient(url: URL(string: RPC_URL)!)
            account = try EthereumAccount(keyStorage: user )
            address = account.address
        } catch {
             return nil
        }
    }
    
    func getAccounts() {
        self.publicAddress = address.value
    }
    

    func checkLatestBlockChanged() async -> Bool {
        return await withCheckedContinuation({ continuation in
            client.eth_blockNumber { [weak self] _, val in
                guard let val = val, self?.latestBlock != val else {
                    continuation.resume(returning: false)
                    return
                }
                self?.latestBlock = val
                continuation.resume(returning: true)
            }
        })
    }
    
    func getBalance() {
        Task {
            let blockChanged = await checkLatestBlockChanged()
            guard blockChanged == true else {
                return
            }
            let balance = client.eth_getBalance(address: self.address, block: .Latest) { [unowned self] error, val in
                if let error = error {
                    print(error)
                }
                let balance = TorusWeb3Utils.toEther(wei: Wei(val ?? 0))
                DispatchQueue.main.async { [weak self] in
                    self?.balance = balance
                }
            }
            
        }
    }
    
    func signMessage() {
        do {
            let val = try account.sign(message: "Hello World")
            self.signedMessageHashString = val.web3.hexString
        } catch {
            self.signedMessageHashString = "Something Went Wrong"
        }
    }
    
    func sendTransaction()  {
        Task{
            do {
                let val = try await transferAsset(sendTo: "0x24BfD1c2D000EC276bb2b6af38C47390Ae6B5FF0", amount: 0.0001, maxTip: 0.0001)
                self.sentTransactionID = val
            } catch {
                self.sentTransactionID = "Something Went Wrong"
            }
            
        }
        
    }
    
    func transferAsset(sendTo: String, amount: Double, maxTip: Double, gasLimit: BigUInt = 21000) async throws -> String {
        let gasPrice = try await client.eth_gasPrice()
        let maxTipInGwie = BigUInt(TorusWeb3Utils.toEther(Gwie: BigUInt(amount)))
        let totalGas = gasPrice + maxTipInGwie
        let amtInGwie = TorusWeb3Utils.toWei(ether: amount)
        let nonce = try await client.eth_getTransactionCount(address: address, block: .Latest)
        let transaction = EthereumTransaction(from: address, to: EthereumAddress(sendTo), value: amtInGwie, data: Data(), nonce: nonce + 1, gasPrice: totalGas, gasLimit: gasLimit, chainId: chainID)
        let signed = try account.sign(transaction: transaction)
        let val = try await client.eth_sendRawTransaction(signed.transaction, withAccount: account)
        return val
    }
    
}

extension Web3AuthState:EthereumKeyStorageProtocol {
    public func storePrivateKey(key: Data) throws {
        
    }
    
    public func loadPrivateKey() throws -> Data {
        guard let privKeyData = self.privKey?.web3.hexData else {
            throw SampleAppError.somethingWentWrong
        }
        return privKeyData
        
    }
    
    
}

public enum SampleAppError:Error{
    
    case noInternetConnection
    case decodingError
    case somethingWentWrong
    case customErr(String)
}
