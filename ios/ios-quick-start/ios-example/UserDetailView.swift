import SwiftUI
import Web3Auth

struct UserDetailView: View {
    @State private var isPrivateKeySectionVisible = false
    @State private var showingAlert = false
    @StateObject var web3RPC: Web3RPC
    @StateObject var viewModel: ViewModel

    var body: some View {
        if let user = viewModel.user {
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
                              
                                try await viewModel.logout()
                               
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
