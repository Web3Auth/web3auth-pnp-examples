//
//  LoginView.swift
//  ios-playground
//
//  Created by Ayush B on 25/04/24.
//

import SwiftUI

struct LoginView: View {
    @StateObject var viewModel: MainViewModel
    @State private var email: String = ""
    
    var body: some View {
        VStack(spacing: 16) {
            Spacer()
            Text("Web3Auth iOS Playground").font(.title).multilineTextAlignment(.center).padding()
            TextField("Enter your email", text: $email).textFieldStyle(.roundedBorder).padding()
            Button(action: {
                viewModel.login(email: email)
            }, label: {
                Text("Sign in with Email Passwordless")
            }).buttonStyle(.bordered)
            Spacer()
        }.padding(.all, 8).alert(isPresented: $viewModel.showAlert, content: {
            Alert(title: Text(viewModel.alertContent), dismissButton: .default(Text("Okay"))
            )
        })
        
    }
}

#Preview {
    LoginView(viewModel: MainViewModel())
}

