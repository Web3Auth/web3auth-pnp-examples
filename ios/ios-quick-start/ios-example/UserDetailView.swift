import SwiftUI
import Web3Auth
import web3

struct UserDetailView: View {
    @State private var isPrivateKeySectionVisible = false
    @State var user: Web3AuthState?
    @Binding var loggedIn: Bool
    @State private var showingAlert = false
    @StateObject var web3RPC: Web3RPC

    var body: some View {
        if let user = user {
            List {
                // IMP START - Get User Info
                Section(header: Text("User Information")) {
                    Text("Name: \(user.userInfo?.name ?? "")")
                    Text("Email: \(user.userInfo?.email ?? "")")
                }
                // IMP END - Get User Info

                Section(header: Text("Public Address")) {
                    Button {
                        web3RPC.getAccounts()
                    } label: {
                        Label("Get Public Address", systemImage: "person.crop.circle")
                    }
                    if !web3RPC.publicAddress.isEmpty {
                        Text("\(web3RPC.publicAddress)")
                    }
                }

                Section(header: Text("Blockchain Calls")) {
                    Button {
                        web3RPC.getBalance()
                    } label: {
                        Label("Get Balance", systemImage: "dollarsign.circle")
                    }
                    if web3RPC.balance >= 0 {
                        Text("\(web3RPC.balance) ETH")
                    }

                    Button {
                        web3RPC.signMessage()
                    } label: {
                        Label("Sign Transaction", systemImage: "pencil.circle")
                    }
                    if !web3RPC.signedMessageHashString.isEmpty {
                        Text("\(web3RPC.signedMessageHashString)")
                    }

                    Button {
                        web3RPC.sendTransaction()
                    } label: {
                        Label("Send Transaction", systemImage: "paperplane.circle")
                    }
                    if !web3RPC.sentTransactionID.isEmpty {
                        Text("\(web3RPC.sentTransactionID)")
                    }
                }

                Button {
                    isPrivateKeySectionVisible.toggle()
                } label: {
                    Label("Private Key", systemImage: "key")
                }
                if isPrivateKeySectionVisible {
                    Section(header: Text("Private Key")) {
                        Text("\(user.privKey ?? "")")
                    }
                }

                Section {
                    Button {
                        Task.detached {
                            do {
                                // IMP START - Logout
                                try await Web3Auth(.init(clientId: "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk",
                                                         network: .cyan)).logout()
                                // IMP END - Logout
                                await MainActor.run(body: {
                                    loggedIn.toggle()
                                })
                            } catch {
                                DispatchQueue.main.async {
                                    showingAlert = true
                                }
                            }
                        }
                    } label: {
                        Label("Logout", systemImage: "arrow.left.square.fill")
                            .foregroundColor(.red)
                    }
                    .alert(isPresented: $showingAlert) {
                        Alert(title: Text("Error"), message: Text("Logout failed!"), dismissButton: .default(Text("OK")))
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitleDisplayMode(.inline)
            .navigationTitle("User Details")
        }
    }
}

struct UserDetailView_Previews: PreviewProvider {
    static var previews: some View {
        let user: Web3AuthState = .init(privKey: "12345", ed25519PrivKey: "32334", sessionId: "23234384y7735y47shdj", userInfo: nil, error: nil, coreKitKey: "45676", coreKitEd25519PrivKey: "84567")
        NavigationView {
            UserDetailView(user: user, loggedIn: .constant(true), web3RPC: .init(user: user)!)
        }
    }
}
