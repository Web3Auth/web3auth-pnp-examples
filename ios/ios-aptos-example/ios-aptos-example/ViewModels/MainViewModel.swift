//
//  MainViewModel.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import Foundation
import Web3Auth
import UIKit

class MainViewModel: ObservableObject {
    var web3AuthHelper: Web3AuthHelper!
    var aptosHelper: AptosHelper!
    
    @Published var isUserAuthenticated: Bool = false
    @Published var showAlert: Bool = false
    @Published var isAccountLoaded: Bool = false
    @Published var balance: String = "0.0"
    
    var alertContent: String = ""
    
    
    func initilize() {
        Task {
            web3AuthHelper = Web3AuthHelper()
            aptosHelper = AptosHelper()
            await web3AuthHelper.initialize()
            try await aptosHelper.initialize()
            DispatchQueue.main.async {
                self.isUserAuthenticated = self.web3AuthHelper.isUserAuthenticated()
            }
            
            if self.web3AuthHelper.isUserAuthenticated() {
                self.loadAccount()
            }
        }
    }
    
    func getAptosPrivateKey() throws -> String {
        return try web3AuthHelper.getAptosPrivateKey()
    }
    
    var accountAddress: String {
        return aptosHelper.account.accountAddress.description
    }
    
    func loadAccount() {
        Task {
            do {
                let privateKey = try web3AuthHelper.getAptosPrivateKey()
                try aptosHelper.generateAptosAccount(privateKey: privateKey)
                self.balance = try await aptosHelper.getBalance()
                
                DispatchQueue.main.async {
                    self.isAccountLoaded = true
                }
                
            } catch let error {
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
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
    
    func selfTransfer() {
        Task {
            do {
                let hash = try await aptosHelper.selfTransfer()
                showAlert(content: "Hash: \(hash)")
                let balance = try await aptosHelper.getBalance()
                DispatchQueue.main.async {
                    self.balance = balance
                }
            } catch let error {
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
    func showPrivateKey() {
        do {
            let privateKey = try web3AuthHelper.getAptosPrivateKey()
            UIPasteboard.general.string = privateKey
            showAlert(content: privateKey)
        } catch let error {
            showAlert(content: error.localizedDescription)
        }
    }
    
    func showUserInfo() {
        do {
            let userDetails = try web3AuthHelper.getUserDetails()
            showAlert(content: try userDetails.toDictionary().description)
        } catch let error {
            showAlert(content: error.localizedDescription)
        }
    }
    
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
    
    func copyAddress() {
        UIPasteboard.general.string = accountAddress
        showAlert(content: "Address is copied to clipboard")
    }
    
    func login(){
        Task {
            do {
                try await web3AuthHelper.login()
                DispatchQueue.main.async {
                    self.isUserAuthenticated = true
                    self.loadAccount()
                }
            } catch let error {
                print(error.localizedDescription)
                showAlert(content: error.localizedDescription)
            }
        }
    }
    
    func showAlert(content: String) {
        alertContent = content
        DispatchQueue.main.async {
            self.showAlert = true
        }
    }
    
    func getUserInfo() throws -> Web3AuthUserInfo {
        try web3AuthHelper.getUserDetails()
    }
}
