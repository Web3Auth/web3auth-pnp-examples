//
//  Web3AuthHelper.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import Foundation
import Web3Auth

class Web3AuthHelper {
    
    var web3Auth: Web3Auth!
    
    func initialize() async {
        web3Auth = await Web3Auth(
            W3AInitParams(
                clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
                network: Network.sapphire_mainnet,
                redirectUrl: "com.w3a.ios-aptos-example://auth"
            )
        )
    }
    
    func isUserAuthenticated() -> Bool {
        return web3Auth.state != nil
    }
    
    func logOut() async throws {
        return try await web3Auth.logout()
    }
    
    func getUserDetails() throws -> Web3AuthUserInfo {
        return try web3Auth.getUserInfo()
    }
    
    func getAptosPrivateKey() throws -> String {
        return web3Auth.getEd25519PrivKey()
    }
    
    func login() async throws {
        let _ = try await web3Auth.login(W3ALoginParams(
            loginProvider: Web3AuthProvider.GOOGLE)
        )
        
        return
    }
}
