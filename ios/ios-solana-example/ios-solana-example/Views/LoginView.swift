//
//  LoginView.swift
//  ios-solana-example
//
//  Created by Ayush B on 26/02/24.
//

import SwiftUI

struct LoginView: View {
    @StateObject var viewModel: ViewModel
    
    var body: some View {
        VStack(spacing: 16) {
            Spacer()
            Text("Web3Auth iOS Solana Sample").font(.title).multilineTextAlignment(.center)
            Button(action: {
                viewModel.login()
            }, label: {
                Text("Sign in with Google")
            }).buttonStyle(.bordered)
            Spacer()
        }.padding(.all, 8).alert(isPresented: Binding<Bool>(
            get: { self.viewModel.isErrorAvailable},
            set: { _ in self.viewModel.isErrorAvailable.toggle()}
        ), content: {
            Alert(title: Text(viewModel.error), dismissButton: .default(Text("Okay"))
            )
        })
        
    }
}

#Preview {
    LoginView(viewModel: ViewModel())
}
