//
//  HomeView.swift
//  ios-solana-example
//
//  Created by Ayush B on 26/02/24.
//

import SwiftUI
import Web3Auth

struct HomeView: View {
    @StateObject var solanaViewModel: SolanaViewModel
    @StateObject var viewModel: ViewModel
    
    @State var hash: String  = ""
    @State var signature: String = ""
    @State var privateKey: String = ""
    @State var userInfo: Web3AuthUserInfo? = nil
    
    
    var body: some View {
        List {
            Section(
                header: Text("Sol Balance"),
                content: {
                    if solanaViewModel.isAccountLoaded {
                        Text(solanaViewModel.balance)
                    } else {
                        ProgressView()
                    }
                }
            )
            Section(
                header: Text("Public Address"),
                content: {
                    if solanaViewModel.isAccountLoaded {
                        Text(
                            solanaViewModel.keyPair.publicKey.description
                        )
                    } else {
                        ProgressView()
                    }
                }
            )
            Section(
                header: Text("Solana Blockchain calls"),
                content: {
                    Button(action: {
                        solanaViewModel.selfTransferSol() {
                            (result, error) -> () in
                            if result != nil {
                                self.hash = result!
                            } else {
                                self.hash = error!.localizedDescription
                            }
                        }
                    }, label: {
                        Text("Self transfer 0.0001 Sol")
                    })
                    
                    if !hash.isEmpty {
                        Text(hash)
                    }
                    
                    Button(action: {
                        solanaViewModel.signSelfTransferSol() {
                            (result, error) -> () in
                            
                            if result != nil {
                                self.signature = result!
                            } else {
                                self.signature = error!.localizedDescription
                            }
                            
                        }
                        
                    }, label: {
                        Text("Sign Self transfer 0.0001 Sol")
                    })
                    
                    if !signature.isEmpty {
                        Text(hash)
                    }
                    
                    Button(action: {
                       privateKey = try! viewModel.getSolanaPrivateKey()
                    }, label: {
                        Text("Show Private key")
                    })
                    
                    if !privateKey.isEmpty {
                        Text(privateKey)
                    }
                    
                    Button(action: {
                       userInfo = try! viewModel.getUserInfo()
                    }, label: {
                        Text("Get User info")
                    })
                    
                    if userInfo != nil {
                        Text(userInfo.debugDescription)
                    }
                }
            )
            Section{
                Button(action: {
                    viewModel.logOut()
                }, label: {
                    Text("Log Out")
                })
            }
        }.onAppear(perform: {
            solanaViewModel.initialize(
                privateKey: try! viewModel.getSolanaPrivateKey()
            )
        })
    }
}

#Preview {
    HomeView(
        solanaViewModel: SolanaViewModel(),
        viewModel: ViewModel()
    )
}
