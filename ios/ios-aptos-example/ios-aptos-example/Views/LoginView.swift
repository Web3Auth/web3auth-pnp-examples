//
//  LoginView.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import SwiftUI

struct LoginView: View {
    @StateObject var viewModel: MainViewModel
    
    var body: some View {
        VStack(spacing: 16) {
            Spacer()
            Text("Web3Auth iOS Aptos Sample").font(.title).multilineTextAlignment(.center)
            Button(action: {
                viewModel.login()
            }, label: {
                Text("Sign in with Google")
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
