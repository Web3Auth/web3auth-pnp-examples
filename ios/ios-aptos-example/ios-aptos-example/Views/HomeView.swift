//
//  HomeView.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import SwiftUI

struct HomeView: View {
    @StateObject var viewModel: MainViewModel
    
    var body: some View {
        if viewModel.isAccountLoaded {
            List {
                Section(
                    header: Text("Aptos Balance"),
                    content: {
                        Text(viewModel.balance)
                        Text("The sample uses Aptos testnet, you can request faucet from aptosfaucet.com.").font(.caption)
                    }
                )
                
                Section(
                    header: Text("Public Address"),
                    content: {
                        Button(viewModel.accountAddress.addressAbbreivation(), action: {
                            viewModel.copyAddress()
                        })
                        Text("Tap on the address to copy.").font(.caption)
                    }
                )
                Section(
                    header: Text("Aptos Blockchain calls"),
                    content: {
                        Button(action: {
                            viewModel.signMessage()
                        }, label: {
                            Text("Sign Message")
                        })
                        
                        Button(action: {
                            viewModel.selfTransfer()
                            
                        }, label: {
                            Text("Self transfer 0.0001 Aptos")
                        })
                        
                        Text("The sample uses Aptos testnet, you can choose any Aptos network. Self transfer 0.0001 Aptos will perform self transfer of Aptos. You'll need to have testnet faucet to perform transaction.").font(.caption)
                        
                        Button(action: {
                            viewModel.airdropFaucet()
                            
                        }, label: {
                            Text("Request Testnet Faucet")
                        })
                                                            
                    }
                )
                
                Section(header: Text("Web3Auth Functions")){
                    Button(action: {
                        viewModel.showPrivateKey()
                    }, label: {
                        Text("Reveal Private key")
                    })
                    
                    Button(action: {
                        viewModel.showUserInfo()
                    }, label: {
                        Text("Show User info")
                    })
                    
                    Button(action: {
                        viewModel.logOut()
                    }, label: {
                        Text("Log Out")
                    })
                }
            }.alert(isPresented: $viewModel.showAlert, content: {
                Alert(title: Text(viewModel.alertContent))
            })
        } else {
            ProgressView()
        }
    }
}
