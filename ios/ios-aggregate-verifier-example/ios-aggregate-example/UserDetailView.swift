import SwiftUI
import Web3Auth
import web3

struct UserDetailView: View {
    @State private var showingAlert = false
    @StateObject var web3RPC: Web3RPC
    @StateObject var viewModel: ViewModel
    
    var body: some View {
        if let user = viewModel.user {
            List {
                Section {
                    Text("\(user.privKey ?? "")")
                } header: {
                    Text("Private key")
                }
                Section{
                    Button {
                        web3RPC.getAccounts()

                    } label: {
                        HStack{
                            Text("Get Public Key")
                            Spacer()
                        }
                    }
                    if(web3RPC.publicAddress != ""){
                        Text("\(web3RPC.publicAddress)")
                    }
                     
                } header: {
                    Text("Public key")
                }
                Section {
                    Text("Name \(user.userInfo?.name ?? "")")
                    Text("Email \(user.userInfo?.email ?? "")")
                }
                header: {
                    Text("User Info")
                }
                Section{
                   Button {
                       web3RPC.getBalance()

                   } label: {
                       HStack{
                           Text("Get Balance")
                           Spacer()
                       }
                   }
                    if(web3RPC.balance>=0){
                        Text("\(web3RPC.balance) Eth")
                        
                    }
                    Button {
                        web3RPC.signMessage()
                    } label: {
                        HStack{
                            Text("Sign Transaction")
                            Spacer()
                        }
                    }
                    if(web3RPC.signedMessageHashString != "") {
                        Text("\(web3RPC.signedMessageHashString)")
                    }
                    Button{
                        web3RPC.sendTransaction()
                    } label: {
                        HStack{
                            Text("Send Transaction")
                            Spacer()
                        }
                    }
                    if(web3RPC.sentTransactionID != "") {
                        Text("\(web3RPC.sentTransactionID)")
                    }
                    
                }
                header: {
                    Text("Blockchain Calls")
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
                        Text("Logout")
                            .foregroundColor(.red)
                    }
                    .alert(isPresented: $showingAlert) {
                        Alert(title: Text("Error"), message: Text("Logout failed!"), dismissButton: .default(Text("OK")))
                    }
                }
            }
            .listStyle(.automatic)
        }
    }
}
