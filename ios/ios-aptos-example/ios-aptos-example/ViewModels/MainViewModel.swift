//
//  MainViewModel.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import Foundation
import Web3Auth
import UIKit

/// The MainViewModel is responsible for managing the business logic of the app, including handling user authentication, interacting with Web3Auth, managing the Aptos account, and displaying relevant data to the UI.
class MainViewModel: ObservableObject {
    // MARK: - Properties
    var web3AuthHelper: Web3AuthHelper!
    var aptosHelper: AptosHelper!
    var address: String!
    var userInfo: Web3AuthUserInfo!
    
    @Published var isUserAuthenticated: Bool = false
    @Published var showAlert: Bool = false
    @Published var isAccountLoaded: Bool = false
    @Published var balance: String = "0.0"
    
    var alertContent: String = ""
    
    // MARK: - Initialization
    
    /// Initializes the Web3Auth and AptosHelper asynchronously. If successful, it updates the authentication status and loads the Aptos account.
    func initialize() {
        Task {
            web3AuthHelper = Web3AuthHelper()
            aptosHelper = AptosHelper()
            print("Initializing Web3Auth")
            do {
                // Step 1: Initialize Web3Auth
                try await web3AuthHelper.initialize()
                print("Web3Auth initialized successfully")
                
                // Step 2: Retrieve Aptos private key and initialize AptosHelper
                let privateKey = try web3AuthHelper.getAptosPrivateKey()
                try await aptosHelper.initialize(privateKey: privateKey)
                print("AptosHelper initialized successfully")
                
            } catch let error {
                // Handle errors from both Web3Auth and AptosHelper initialization
                print("Error during initialization:", error.localizedDescription)
                showAlert(content: "Error during initialization: \(error.localizedDescription)")
                return  // Exit early on failure
            }
            
            // Step 3: Update authentication status
            DispatchQueue.main.async {
                self.isUserAuthenticated = self.web3AuthHelper.isUserAuthenticated()
                print("isUserAuthenticated:", self.isUserAuthenticated)
            }
            
            // Step 4: Load the account if authenticated
            if self.web3AuthHelper.isUserAuthenticated() {
                self.loadAccount(showLoader: true)
            }
        }
    }
    
    /// Retrieves the Aptos private key from Web3Auth.
    func getAptosPrivateKey() throws -> String {
        return try web3AuthHelper.getAptosPrivateKey()
    }
    
    /// Returns the Aptos account address.
    var accountAddress: String {
        return aptosHelper.account.accountAddress.toString()
    }
    
    /// Loads the Aptos account by fetching the balance and updating the UI state.
    /// - Parameter showLoader: A Boolean flag to show or hide the loader during the process.
    func loadAccount(showLoader: Bool = false) {
        Task {
            do {
                print("Starting to load account...")
                
                // Step 1: Fetch Aptos private key
                let privateKey = try web3AuthHelper.getAptosPrivateKey()
                print("Aptos private key fetched: ", privateKey)
                
                // Step 2: Generate the Aptos account using the private key
                let account = try aptosHelper.generateAptosAccount(privateKey: privateKey)
                print("Aptos account generated.", account.accountAddress.toString())
                
                // Step 3: Fetch the balance
                try await loadBalance()
                
                // Step 4: Update the UI state
                DispatchQueue.main.async {
                    self.isAccountLoaded = true
                }
                
            } catch let error {
                print("Error in loadAccount: \(error.localizedDescription)")
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
    /// Signs a message with the Aptos account's private key and displays the signature.
    func signMessage() {
        Task {
            do {
                let signature = try aptosHelper.signMessage(message: "Welcome to Web3Auth")
                showAlert(content: signature)
            } catch let error {
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
    /// Initiates a self-transfer of Aptos coins and updates the balance after the transaction.
    func selfTransfer() {
        Task {
            do {
                // Step 1: Initiate self-transfer
                let hash = try await aptosHelper.selfTransfer()
                print("Self-transfer successful with hash: \(hash)")
                showAlert(content: "Self-transfer successful with hash: \(hash). Wait for a few seconds to reflect!")
                
                // Step 2: Reload balance after the transfer
                try await loadBalance()
            } catch let error {
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
    /// Loads the Aptos account balance and updates the UI state.
    private func loadBalance() async throws {
        let balance = try await aptosHelper.getBalance()
        DispatchQueue.main.async {
            self.balance = balance
        }
    }
    
    /// Requests an airdrop from the Aptos testnet faucet and updates the balance.
    func airdropFaucet() {
        Task {
            do {
                // Step 1: Request airdrop
                let txnHash = try await aptosHelper.airdropFaucet()
                showAlert(content: "Airdropped 1 Aptos. Transaction hash: \(txnHash). Wait for a few seconds to reflect!")
                
                // Step 2: Reload balance after airdrop
                try await loadBalance()
            } catch let error {
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
    /// Displays the Aptos private key and copies it to the clipboard.
    func showPrivateKey() {
        do {
            let privateKey = try web3AuthHelper.getAptosPrivateKey()
            UIPasteboard.general.string = privateKey
            showAlert(content: "Private Key copied to clipboard")
        } catch let error {
            showAlert(content: error.localizedDescription)
        }
    }
    
    /// Displays the authenticated user's information.
    func showUserInfo() {
        do {
            let userDetails = try web3AuthHelper.getUserDetails()
            showAlert(content: try userDetails.toDictionary().description)
        } catch let error {
            showAlert(content: error.localizedDescription)
        }
    }
    
    /// Logs out the current user and resets the authentication state.
    func logOut() {
        Task {
            do {
                try await web3AuthHelper.logOut()
                DispatchQueue.main.async {
                    self.isUserAuthenticated = false
                }
            } catch let error {
                print(error.localizedDescription)
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
    /// Copies the Aptos account address to the clipboard and displays an alert.
    func copyAddress() {
        UIPasteboard.general.string = accountAddress
        showAlert(content: "Address copied to clipboard")
    }
    
    /// Logs in the user using an email address for passwordless authentication.
    /// - Parameter email: The email address used for passwordless login.
    func login(email: String) {
        Task {
            do {
                print("Attempting login for email:", email)
                try await web3AuthHelper.login(email: email)
                DispatchQueue.main.async {
                    self.isUserAuthenticated = true
                    print("Login successful. User authenticated.")
                    self.loadAccount()
                }
            } catch let error {
                print("Login failed with error:", error.localizedDescription)
                showAlert(content: "Login failed: \(error.localizedDescription)")
            }
        }
    }
    
    /// Displays an alert with the given content.
    /// - Parameter content: The content to be displayed in the alert.
    func showAlert(content: String) {
        alertContent = content
        DispatchQueue.main.async {
            self.showAlert = true
        }
    }
}
