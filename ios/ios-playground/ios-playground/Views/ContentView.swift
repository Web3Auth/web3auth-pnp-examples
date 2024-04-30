//
//  ContentView.swift
//  ios-playground
//
//  Created by Ayush B on 25/04/24.
//

import SwiftUI

struct ContentView: View {
    @StateObject var viewModel: MainViewModel
    
    var body: some View {
        NavigationView {
            if viewModel.isUserAuthenticated {
                HomeView(viewModel: viewModel)
            } else {
                LoginView(viewModel: viewModel)
            }
        }.onAppear{
            viewModel.initilize()
        }
    }
}

#Preview {
    ContentView(viewModel: MainViewModel())
}
