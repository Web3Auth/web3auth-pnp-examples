import Foundation
// IMP START - Quick Start
import Web3Auth
// IMP END - Quick Start

class ViewModel: ObservableObject {
    var web3Auth: Web3Auth?
    @Published var loggedIn: Bool = false
    @Published var user: Web3AuthState?
    @Published var isLoading = false
    @Published var navigationTitle: String = ""
    // IMP START - Get your Web3Auth Client ID from Dashboard
    private var clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"
    // IMP END - Get your Web3Auth Client ID from Dashboard
    // IMP START - Whitelist bundle ID
    private var network: Network = .sapphire_mainnet
    // IMP END - Whitelist bundle ID
    func setup() async {
        guard web3Auth == nil else { return }
        await MainActor.run(body: {
            isLoading = true
            navigationTitle = "Loading"
        })
        
        // IMP START - Initialize Web3Auth
        do {
            web3Auth = try await Web3Auth(W3AInitParams(
                clientId: clientId,
                network: network,
                redirectUrl: "web3auth.ios-example://auth",
                chainNamespace: .eip155
            ))
        } catch {
            print("Something went wrong")
        }
        // IMP END - Initialize Web3Auth
        await MainActor.run(body: {
            if self.web3Auth?.state != nil {
                user = web3Auth?.state
                loggedIn = true
            }
            isLoading = false
            navigationTitle = loggedIn ? "UserInfo" : "SignIn"
        })
    }
    
    func login(provider: Web3AuthProvider) {
        Task {
            do {
                // IMP START - Login
                let result = try await web3Auth?.login(
                    W3ALoginParams(loginProvider: provider)
                )
                // IMP END - Login
                await MainActor.run(body: {
                    user = result
                    loggedIn = true
                })
                
            } catch {
                print("Error")
            }
        }
    }
    
    func manageMFA() {
        Task {
            do {
                let value = try await web3Auth?.manageMFA(
                    W3ALoginParams(loginProvider: .EMAIL_PASSWORDLESS, extraLoginOptions: ExtraLoginOptions(login_hint: web3Auth?.getUserInfo().email))
                )
                print(value)
            } catch {
                print(error.localizedDescription)
            }
        }
    }
    
    func logout() throws {
        Task {
            // IMP START - Logout
            try await web3Auth?.logout()
            // IMP END - Logout
            await MainActor.run(body: {
                loggedIn = false
            })
        }
    }
    
    func loginEmailPasswordless(provider: Web3AuthProvider, email: String) {
        Task {
            do {
                // IMP START - Login
                let result = try await web3Auth?.login(W3ALoginParams(loginProvider: provider, extraLoginOptions: ExtraLoginOptions(display: nil, prompt: nil, max_age: nil, ui_locales: nil, id_token_hint: nil, id_token: nil, login_hint: email, acr_values: nil, scope: nil, audience: nil, connection: nil, domain: nil, client_id: nil, redirect_uri: nil, leeway: nil, verifierIdField: nil, isVerifierIdCaseSensitive: nil, additionalParams: nil)))
                // IMP END - Login
                await MainActor.run(body: {
                    user = result
                    loggedIn = true
                    navigationTitle = "UserInfo"
                })
                
            } catch {
                print("Error")
            }
        }
    }
}
