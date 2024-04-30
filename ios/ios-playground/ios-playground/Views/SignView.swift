//
//  SignView.swift
//  ios-playground
//
//  Created by Ayush B on 26/04/24.
//

import SwiftUI

enum SignOptions {
    case signMessage
    case sendTransaction
}

struct SignView: View {
    @StateObject var viewModel: MainViewModel
    @State private var selectedTab: SignOptions = .signMessage
    @State private var messageTextField: String = ""
    @State private var valueTextField: String = ""
    @State private var addressTextField: String = ""
    
    var body: some View {
        VStack {
            Text("Signing/Transaction").listRowSeparator(.hidden)
                .font(.largeTitle)
            Spacer().frame(height: 16)
            Picker("Choose view", selection: $selectedTab) {
                Text("Sign Message").tag(SignOptions.signMessage)
                Text("Send Transaction").tag(SignOptions.sendTransaction)
            }.pickerStyle(.segmented).padding()
            if selectedTab == .signMessage {
                SignMessageView(
                    messageTextField: $messageTextField,
                    onSignRequest: {
                        viewModel.signMessage(message: messageTextField)
                    }
                )
            } else {
                SendTransactionView(
                    valueTextField: $valueTextField,
                    addressTextField: $addressTextField,
                    onSendRequest: {
                        viewModel.sendTransaction(
                            to: addressTextField,
                            value: valueTextField
                        )
                    }
                )
            }
        }
    }
}

struct SendTransactionView: View {
    @Binding var valueTextField: String
    @Binding var addressTextField: String
    var onSendRequest: () -> ()
    
    var body: some View {
        List {
            TextField("Enter the value", text: $valueTextField)
                .textFieldStyle(.roundedBorder)
                .listRowSeparator(.hidden)
          
            TextField("Enter destination address", text: $addressTextField)
                .textFieldStyle(.roundedBorder)
                .listRowSeparator(.hidden)
            Button {
                onSendRequest()
            } label: {
                Text("Send Transaction").frame(maxWidth: /*@START_MENU_TOKEN@*/.infinity/*@END_MENU_TOKEN@*/)
            }.buttonStyle(.bordered).listRowSeparator(.hidden)
            
        }.listStyle(.plain)
    }
}

struct SignMessageView: View {
    @Binding var messageTextField: String
    var onSignRequest: () -> ()
    
    var body: some View {
        List {
            TextField("Enter message to sign", text: $messageTextField)
                .listRowSeparator(.hidden).textFieldStyle(.roundedBorder)
            Button(action: {
                onSignRequest()
            }, label: {
                Text("Sign Message").frame(maxWidth: .infinity)
            }).listRowSeparator(.hidden).buttonStyle(.bordered)
        }.listStyle(.plain)
    }
}


#Preview {
    SignView(viewModel: MainViewModel())
}
