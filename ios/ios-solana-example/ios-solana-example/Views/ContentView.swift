//
//  ContentView.swift
//  ios-solana-example
//
//  Created by Ayush B on 24/02/24.
//

import SwiftUI

struct ContentView: View {
    @StateObject var viewModel: ViewModel
    
    var body: some View {
        NavigationView {
            if viewModel.isUserAuthenticated {
                HomeView(
                    solanaViewModel: SolanaViewModel(),
                    viewModel: viewModel
                )
            } else {
                LoginView(viewModel: viewModel)
            }
        }.onAppear{
            viewModel.initilize()
        }
    }
}

#Preview {
    ContentView(viewModel: ViewModel())
}
