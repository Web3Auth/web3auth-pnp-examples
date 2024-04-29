//
//  ContractInteractionView.swift
//  ios-playground
//
//  Created by Ayush B on 29/04/24.
//

import SwiftUI

enum ContractInteractions {
    case readContract
    case writeContract
}

struct ContractInteractionView: View {
    @StateObject var viewModel: MainViewModel
    @State var contractAddressTextField: String = ""
    @State var spenderAddressTextField: String = ""
    @State private var selectedTab: ContractInteractions = .readContract
    
    var body: some View {
        VStack {
            Text("Smart Contract Interactions")
                .listRowSeparator(.hidden)
                .font(.largeTitle).multilineTextAlignment(.center)
            Spacer().frame(height: 16)
            Picker("Choose view", selection: $selectedTab) {
                Text("Read Contract").tag(ContractInteractions.readContract)
                Text("Write Contract").tag(ContractInteractions.writeContract)
            }.pickerStyle(.segmented).padding()
            
            if selectedTab == .readContract {
                ReadContractView(
                    contractAddressTextField: $contractAddressTextField,
                    onFetchBalance: {
                        viewModel.getERC20Balance(
                            contractAddress: contractAddressTextField
                        )
                    }
                )
            } else {
                WriteContractView(
                    contractAddressTextField: $contractAddressTextField,
                    spenderAddressTextField: $spenderAddressTextField,
                    onRevoke: {
                        viewModel.revokeApporval(
                            contractAddress: contractAddressTextField,
                            spenderAddress: spenderAddressTextField
                        )
                    }
                )
            }
        }
    }
}

struct ReadContractView: View {
    @Binding var contractAddressTextField: String
    let onFetchBalance: () -> ()
    
    var body: some View {
        List {
            TextField(
                "Enter contract address",
                text: $contractAddressTextField
            ).listRowSeparator(.hidden)
                .textFieldStyle(.roundedBorder)
            
            Button(
                action: {
                    onFetchBalance()
                },
                label: {
                    Text("Fetch Balance")
                        .frame(maxWidth: .infinity)
                }
            ).listRowSeparator(.hidden).buttonStyle(.bordered)
        }.listStyle(.plain)
    }
}

struct WriteContractView: View {
    @Binding var contractAddressTextField: String
    @Binding var spenderAddressTextField: String
    let onRevoke: () -> ()
    
    var body: some View {
        List {
            TextField(
                "Enter contract address",
                text: $contractAddressTextField
            ).listRowSeparator(.hidden)
                .textFieldStyle(.roundedBorder)
            
            TextField(
                "Enter spender address",
                text: $spenderAddressTextField
            ).listRowSeparator(.hidden)
                .textFieldStyle(.roundedBorder)
            
            Button(
                action: {
                    onRevoke()
                },
                label: {
                    Text("Revoke Approval")
                        .frame(maxWidth: .infinity)
                }
            ).listRowSeparator(.hidden).buttonStyle(.bordered)
        }.listStyle(.plain)
    }
}

#Preview {
    ContractInteractionView(viewModel: MainViewModel())
}
