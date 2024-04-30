//
//  MainViewModel.swift
//  ios-playground
//
//  Created by Ayush B on 25/04/24.
//

import Foundation
import Web3Auth
import UIKit

class MainViewModel: ObservableObject {
    var web3AuthHelper: Web3AuthHelper!
    var ethereumHelper: EthereumHelper!
    var address: String!
    var useInfo: Web3AuthUserInfo!
  
    @Published var isUserAuthenticated: Bool = false
    @Published var showAlert: Bool = false
    @Published var selectedChainConfig: PlaygroundChainConfig = chainConfigs.first!
    @Published var isAccountLoaded: Bool = false
    @Published var balance: String = "0.0"
    
    
    var alertContent: String = ""
    
    
    func initilize() {
        Task {
            web3AuthHelper = Web3AuthHelper()
            await web3AuthHelper.initialize()
            if(self.web3AuthHelper.isUserAuthenticated()) {
                loadAccount(showLoader: true)
            }
            DispatchQueue.main.async {
                self.isUserAuthenticated = self.web3AuthHelper.isUserAuthenticated()
            }
        }
    }
    
    func getSolanaPrivateKey() throws -> String {
        return try web3AuthHelper.getSolanaPrivateKey()
    }
    
    func logOut() {
        Task {
            do {
                try await web3AuthHelper.logOut()
                DispatchQueue.main.async {
                    self.isUserAuthenticated = false
                }
            } catch let error {
                showAlert(message: error.localizedDescription)
                print(error)
            }
        }
    }
    
    func login(email: String){
        Task {
            do {
                try await web3AuthHelper.login(email: email)
                DispatchQueue.main.async {
                    self.isUserAuthenticated = true
                }
                loadAccount(showLoader: true)
            } catch let error {
                showAlert(message: error.localizedDescription)
                print(error.localizedDescription)
            }
        }
    }
    
    func signMessage(message: String) {
        Task {
            do {
                let signedMessage = try await ethereumHelper.signMessage(message: message)
                showAlert(message: signedMessage)
            } catch {
                print(error.localizedDescription)
                showAlert(message: error.localizedDescription)
            }
        }
    }
    
    func sendTransaction(to: String, value: String) {
        Task {
            do {
                let hash = try await ethereumHelper.sendTransaction(value: value, to: to)
                loadAccount()
                showAlert(message: hash)
            } catch {
                print(error.localizedDescription)
                showAlert(message: error.localizedDescription)
            }
        }
    }
    
    func getUserInfo() throws -> Web3AuthUserInfo {
        try web3AuthHelper.getUserDetails()
    }
    
    private func prepareEthereumHelper() throws {
        self.ethereumHelper = EthereumHelper()
        try self.ethereumHelper.setUp(
            web3AuthState: web3AuthHelper.web3Auth!.state!,
            rpcUrl: selectedChainConfig.rpcTarget,
            chainId: Int(selectedChainConfig.chainId)!
        )
    }
    
    func copyAddress() {
        UIPasteboard.general.string = ethereumHelper.address()
        showAlert(message: "Address copied to clipboard: \(ethereumHelper.address())")
    }
    
    func showUserInfo() {
//        showAlert(message: "\(web3AuthHelper.getUserDetails())")
    }
    
    func getERC20Balance(contractAddress: String) {
        Task {
            do {
                let balance = try await ethereumHelper.balanceOf(contractAddress: contractAddress)
                showAlert(message: balance)
            } catch {
                showAlert(message: error.localizedDescription)
            }
        }
    }
    
    func revokeApporval(contractAddress: String, spenderAddress: String) {
        Task {
            do {
                let hash = try await ethereumHelper.revokeApproval(
                    contractAddress: contractAddress,
                    spenderAddress: spenderAddress
                )
                loadAccount()
                showAlert(message: hash)
            } catch {
                showAlert(message: error.localizedDescription)
            }
        }
    }
    
    func showAlert(message: String) {
        alertContent = message
        DispatchQueue.main.async {
            self.showAlert = true
        }
    }
    
    func loadAccount(showLoader: Bool = false) {
        Task {
            do {
                try prepareEthereumHelper()
                self.address = ethereumHelper.address()
                let localBalance = try await ethereumHelper.getBalance()
                self.useInfo = try web3AuthHelper.getUserDetails()
                DispatchQueue.main.async {
                    self.balance = localBalance
                    if(showLoader) {
                        self.isAccountLoaded = true
                    }
                }
            } catch {
                showAlert(message: error.localizedDescription)
            }
        }
    }
}
