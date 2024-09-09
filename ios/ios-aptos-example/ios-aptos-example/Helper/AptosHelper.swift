import Foundation
import Aptos
import Core
import Transactions
import Types
import Clients
import Crypto

struct Coin: Codable {
    let coin: InnerCoin
    
    struct InnerCoin: Codable {
        let value: String
    }
}

class AptosHelper {
    var aptosClient: Aptos!
    var account: AccountProtocol!
    
    /// Initializes the Aptos client and account using the provided Web3Auth private key.
    /// - Parameter privateKey: The private key received from Web3Auth.
    func initialize(privateKey: String) async throws {
        aptosClient = Aptos(aptosConfig: .testnet)
        account = try generateAptosAccount(privateKey: privateKey)
        
        guard account != nil else {
            throw NSError(domain: "AptosHelper", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to generate Aptos account."])
        }
        
        print("Aptos client and account initialized successfully.")
    }
    
    /// Generates an Aptos account using a Web3Auth private key.
    /// - Parameter privateKey: The Web3Auth private key in hex format.
    /// - Returns: The generated Aptos account.
    func generateAptosAccount(privateKey: String) throws -> AccountProtocol {
        let privateKeyData = Data(hex: privateKey)
        let keyBytes = privateKeyData.bytes.prefix(32)
        
        guard keyBytes.count == 32 else {
            throw NSError(domain: "AptosHelper", code: 2, userInfo: [NSLocalizedDescriptionKey: "Invalid private key length."])
        }
        
        let ed25519PrivateKey = try Ed25519PrivateKey(Data(keyBytes).hexString)
        let account = try Account.fromPrivateKey(ed25519PrivateKey)
        
        print("Aptos account generated with address: \(account.accountAddress.toString())")
        return account
    }

    /// Signs a message using the private key of the generated Aptos account.
    /// - Parameter message: The message to sign.
    /// - Returns: The signature as a string.
    func signMessage(message: String) throws -> String {
        guard let _ = message.data(using: .utf8) else {
            throw NSError(domain: "AptosHelper", code: 3, userInfo: [NSLocalizedDescriptionKey: "Invalid message format."])
        }
        let signature = try account.sign(message: message)
        return signature.toString()
    }
    
    /// Fetches the balance of AptosCoin for the current account.
    /// - Returns: The account balance as a string.
    func getBalance() async throws -> String {
        let aptosCoinResource = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
        
        do {
            let resource: Coin = try await aptosClient.account.getAccountResource(
                address: account.accountAddress,
                resourceType: aptosCoinResource
            )
            
            let atomicBalance = resource.coin.value
            let balanceValue = formatBalanceToString(atomicBalanceString: atomicBalance)
            print("Balance for account \(account.accountAddress.toString()): \(balanceValue)")
            return balanceValue
        } catch {
            throw NSError(domain: "AptosHelper", code: 4, userInfo: [NSLocalizedDescriptionKey: "Failed to fetch balance: \(error.localizedDescription)"])
        }
    }
    
    /// Requests an airdrop of Aptos tokens from the testnet faucet and returns the transaction hash.
    /// - Returns: A string representing the transaction hash of the airdrop request.
    func airdropFaucet() async throws -> String {
        let userTransaction = try await aptosClient.faucet.fundAccount(accountAddress: account.accountAddress, amount: 100_000_000)

        if userTransaction.success {
            print("Airdrop successful! Transaction hash: \(userTransaction.hash)")
        } else {
            throw NSError(domain: "AptosHelper", code: 5, userInfo: [NSLocalizedDescriptionKey: "Airdrop failed with status: \(userTransaction.vmStatus)"])
        }
        return userTransaction.hash
    }

    /// Executes a self-transfer of AptosCoin within the same account.
    /// - Returns: The transaction hash of the self-transfer.
    func selfTransfer() async throws -> String {
        let senderAccount = account!
        let accountAddress = senderAccount.accountAddress
        
        // Build, sign, and submit the transaction
        let rawTxn = try await aptosClient.transaction.build.simple(
            sender: accountAddress,
            data: InputEntryFunctionData(
                function: "0x1::aptos_account::transfer",
                functionArguments: [accountAddress, 100]
            )
        )
        
        let authenticator = try await aptosClient.transaction.sign.transaction(
            signer: senderAccount,
            transaction: rawTxn
        )
        
        let response = try await aptosClient.transaction.submit.simple(
            transaction: rawTxn,
            senderAuthenticator: authenticator
        )
        
        let txn = try await aptosClient.transaction.waitForTransaction(transactionHash: response.hash)
                
        return txn.hash
    }
    
    /// Converts atomic balance string units to human-readable APT balance string.
    /// - Parameter atomicBalanceString: The balance in atomic units as a string.
    /// - Returns: A formatted string representing the balance in APT units.
    private func formatBalanceToString(atomicBalanceString: String) -> String {
        guard let atomicBalance = Int(atomicBalanceString) else {
            return "Invalid balance"
        }
        
        let aptBalance = Double(atomicBalance) / 100_000_000.0
        
        let numberFormatter = NumberFormatter()
        numberFormatter.numberStyle = .decimal
        numberFormatter.maximumFractionDigits = 5
        numberFormatter.minimumFractionDigits = 2
        
        return numberFormatter.string(from: NSNumber(value: aptBalance)) ?? "\(aptBalance)"
    }
}
