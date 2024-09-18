//
//  LoginView.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import SwiftUI

struct LoginView: View {
    @StateObject var viewModel: MainViewModel
    @State private var email: String = ""
    
    var body: some View {
        VStack(spacing: 16) {
            Spacer()
            Text("Web3Auth iOS Aptos Sample").font(.title).multilineTextAlignment(.center).padding()
            TextField("Enter your email", text: $email).textFieldStyle(.roundedBorder).padding()
            Button(action: {
                viewModel.login(email: email)
            }, label: {
                Text("Sign in with Email Passwordless")
            }).buttonStyle(.bordered)
            Spacer()
        }.padding(.all, 8).alert(isPresented: Binding<Bool>(
            get: { self.viewModel.showAlert},
            set: { _ in self.viewModel.showAlert.toggle()}
        ), content: {
            Alert(title: Text(viewModel.alertContent), dismissButton: .default(Text("Okay")))
        })
    }
}
