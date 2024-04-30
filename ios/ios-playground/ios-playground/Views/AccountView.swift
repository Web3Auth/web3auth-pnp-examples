//
//  AccountView.swift
//  ios-playground
//
//  Created by Ayush B on 26/04/24.
//

import SwiftUI

struct AccountView: View {
    @StateObject var viewModel: MainViewModel
    
    var body: some View {
        VStack {
            Text("Welcome to Web3Auth iOS Playground")
                .padding()
                .font(.title)
                .multilineTextAlignment(.center)
            
            List {
                Section (header: Text("Your Account Details"), content: {
                    Picker("Chain", selection: Binding<PlaygroundChainConfig>(get: {
                        return viewModel.selectedChainConfig
                    }, set: {
                        viewModel.selectedChainConfig = $0
                        viewModel.loadAccount()
                    })) {
                        ForEach(chainConfigs, id: \.self) {
                            Text($0.displayName)
                        }
                    }.pickerStyle(.navigationLink)
                })
                Spacer().frame(height: 24)
                Text(
                    viewModel.useInfo.name!.first!.uppercased()
                )
                .colorMultiply(.white)
                .frame(width: 100, height: 100)
                .background(.indigo)
                .cornerRadius(8)
                .font(.title)
                .listRowSeparator(.hidden)
                Text(viewModel.useInfo.name!.uppercased())
                    .lineLimit(1).listRowSeparator(.hidden)
                HStack {
                    Text(viewModel.address.addressAbbreivation())
                    Spacer()
                    Button(action: {
                        viewModel.copyAddress()
                    }, label: {
                        Image(systemName: "doc.on.doc")
                    })
                }.listRowSeparator(.hidden)
                Button(action: {
                    viewModel.showAlert(
                        message: viewModel.useInfo.debugDescription
                    )
                }, label: {
                    Text("View User Info").frame(maxWidth: .infinity)
                }).listRowSeparator(.hidden).buttonStyle(.bordered)
                Button(role: .destructive, action: {
                    viewModel.logOut()
                }, label: {
                    Text("Logout").frame(maxWidth: .infinity)
                }).listRowSeparator(.hidden).buttonStyle(.bordered)
                HStack(content: {
                    VStack(
                        alignment: .leading,
                        content: {
                            Text("Wallet Balance").font(.title3)
                            Spacer().frame(height: 8)
                            Text(String(format: "%.4f", NSDecimalNumber(string: viewModel.balance).floatValue)).font(.title).bold()
                        })
                    Spacer()
                    VStack(
                        alignment: .trailing,
                        content: {
                            Text("Chain ID").font(.title3)
                            Spacer().frame(height: 8)
                            Text(viewModel.selectedChainConfig.chainId).font(.title).bold()
                        })
                }).listRowSeparator(.hidden)
            }.listStyle(.plain).padding()
        }
    }
}

#Preview {
    AccountView(viewModel: MainViewModel())
}
