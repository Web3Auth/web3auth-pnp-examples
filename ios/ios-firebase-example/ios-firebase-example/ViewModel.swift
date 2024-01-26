import Foundation
import Web3Auth
import FirebaseCore
import FirebaseAuth

class ViewModel: ObservableObject {
    var web3Auth: Web3Auth?
    @Published var loggedIn: Bool = false
    @Published var user: Web3AuthState?
    @Published var isLoading = false
    @Published var navigationTitle: String = ""
    private var clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"
    private var network: Network = .sapphire_mainnet
    func setup() async {
        guard web3Auth == nil else { return }
        await MainActor.run(body: {
            isLoading = true
            navigationTitle = "Loading"
        })
        web3Auth = await Web3Auth(W3AInitParams(
            clientId: clientId, network: network,
            loginConfig: [
                TypeOfLogin.jwt.rawValue:
                        .init(
                            verifier: "w3a-firebase-demo",
                            typeOfLogin: .jwt,
                            clientId: self.clientId
                        )
            ],
            whiteLabel: W3AWhiteLabelData(
                    appName: "Web3Auth Stub",
                    logoLight: "https://images.web3auth.io/web3auth-logo-w.svg",
                    logoDark: "https://images.web3auth.io/web3auth-logo-w.svg",
                    defaultLanguage: .en, // en, de, ja, ko, zh, es, fr, pt, nl
                    mode: .dark,
                    theme: ["primary": "#d53f8c"]),
            mfaSettings: MfaSettings(
                deviceShareFactor: MfaSetting(enable: true, priority: 1),
                backUpShareFactor: MfaSetting(enable: true, priority: 2),
                socialBackupFactor: MfaSetting(enable: true, priority: 3),
                passwordFactor: MfaSetting(enable: true, priority: 4)
            ),
            // 259200 allows user to stay authenticated for 3 days with Web3Auth.
            // Default is 86400, which is 1 day.
            sessionTime: 259200
        ))
        await MainActor.run(body: {
            if self.web3Auth?.state != nil {
                user = web3Auth?.state
                loggedIn = true
            }
            isLoading = false
            navigationTitle = loggedIn ? "UserInfo" : "SignIn"
        })
    }
    
    func loginViaFirebaseEP() {
        Task{
            do {
                let res = try await Auth.auth().signIn(withEmail: "custom+id_token@firebase.login", password: "Welcome@W3A")
                let id_token = try await res.user.getIDToken()
                let result = try await web3Auth?.login(
                    W3ALoginParams(
                    loginProvider: .JWT,
                    dappShare: nil,
                    extraLoginOptions: ExtraLoginOptions(display: nil, prompt: nil, max_age: nil, ui_locales: nil, id_token_hint: nil, id_token: id_token, login_hint: nil, acr_values: nil, scope: nil, audience: nil, connection: nil, domain: nil, client_id: nil, redirect_uri: nil, leeway: nil, verifierIdField: "sub", isVerifierIdCaseSensitive: nil, additionalParams: nil),
                    mfaLevel: .NONE,
                    curve: .SECP256K1
                    ))
                await MainActor.run(body: {
                    user = result
                    loggedIn = true
                })

            } catch let error {
                print("Error: ", error)
            }
        }
    }
    
    func logout() async throws {
        try  await web3Auth?.logout()
        
        await MainActor.run(body: {
            loggedIn.toggle()
        })
    }
    
    
}

extension ViewModel {
    func showResult(result: Web3AuthState) {
        print("""
        Signed in successfully!
            Private key: \(result.privKey ?? "")
                Ed25519 Private key: \(result.ed25519PrivKey ?? "")
            User info:
                Name: \(result.userInfo?.name ?? "")
                Profile image: \(result.userInfo?.profileImage ?? "N/A")
                Type of login: \(result.userInfo?.typeOfLogin ?? "")
        """)
    }
}
