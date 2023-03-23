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
    private var clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"
    private var network: Network = .cyan
    func setup() async {
        guard web3Auth == nil else { return }
        await MainActor.run(body: {
            isLoading = true
            navigationTitle = "Loading"
        })
        web3Auth = await Web3Auth(.init(clientId: clientId, network: network))
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
                let res = try await Auth.auth().signIn(withEmail: "custom+jwt@firebase.login", password: "Testing@123")
                let id_token = try await res.user.getIDToken()
                let result = try await Web3Auth(.init(
                    clientId: clientId,
                    network: network,
                    loginConfig: [
                        TypeOfLogin.jwt.rawValue:
                                .init(
                                    verifier: "web3auth-firebase-examples",
                                    typeOfLogin: .jwt
                                )
                    ]
                )).login(
                    W3ALoginParams(
                    loginProvider: .JWT,
                    dappShare: nil,
                    extraLoginOptions: ExtraLoginOptions(display: nil, prompt: nil, max_age: nil, ui_locales: nil, id_token_hint: nil, id_token: id_token, login_hint: nil, acr_values: nil, scope: nil, audience: nil, connection: nil, domain: nil, client_id: nil, redirect_uri: nil, leeway: nil, verifierIdField: "sub", isVerifierIdCaseSensitive: nil),
                    mfaLevel: .NONE,
                    curve: .SECP256K1
                    ))
                await MainActor.run(body: {
                    user = result
                    loggedIn = true
                })

            } catch {
                print("Error")
            }
        }
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
