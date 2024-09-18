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
    
    /// Initializes the Web3Auth client with the required parameters for the specific network.
    /// - Throws: An error if initialization fails.
    func initialize() async throws {
        web3Auth = try await Web3Auth(
            W3AInitParams(
                clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // Replace with your actual client ID
                network: Network.sapphire_mainnet, // Change network based on your requirements
                redirectUrl: "com.w3a.ios-aptos-example://auth" // Update the redirect URL as per your app's configuration
            )
        )
        print("Web3Auth initialized successfully.")
    }
    
    /// Checks if the user is currently authenticated with Web3Auth.
    /// - Returns: A boolean indicating whether the user is authenticated.
    func isUserAuthenticated() -> Bool {
        return web3Auth.state != nil
    }
    
    /// Logs out the currently authenticated user.
    /// - Throws: An error if the logout process fails.
    func logOut() async throws {
        try await web3Auth.logout()
        print("User logged out successfully.")
    }
    
    /// Retrieves the details of the authenticated user.
    /// - Throws: An error if user information retrieval fails.
    /// - Returns: A `Web3AuthUserInfo` object containing user details.
    func getUserDetails() throws -> Web3AuthUserInfo {
        let userInfo = try web3Auth.getUserInfo()
        print("User info retrieved: \(userInfo)")
        return userInfo
    }
    
    /// Retrieves the private key (Ed25519 format) associated with the authenticated user.
    /// - Throws: An error if the private key retrieval fails.
    /// - Returns: The private key as a hex string.
    func getAptosPrivateKey() throws -> String {
        let privateKey = web3Auth.getEd25519PrivKey()
        print("Private key retrieved: \(privateKey)")
        return privateKey
    }
    
    /// Logs in a user using the passwordless email option via Web3Auth.
    /// - Parameter email: The user's email for login.
    /// - Throws: An error if the login process fails.
    func login(email: String) async throws {
        let _ = try await web3Auth.login(
            W3ALoginParams(
                loginProvider: Web3AuthProvider.EMAIL_PASSWORDLESS, // Using passwordless email login
                extraLoginOptions: ExtraLoginOptions(login_hint: email) // Providing the email as a login hint
            )
        )
        print("User logged in successfully with email: \(email)")
    }
}
