//
//  HomeView.swift
//  ios-playground
//
//  Created by Ayush B on 25/04/24.
//

import SwiftUI
import Web3Auth

struct HomeView: View {
    @StateObject var viewModel: MainViewModel
    
    var body: some View {
        NavigationView {
            if(viewModel.isAccountLoaded) {
                
                SegmentedControlView(viewModel: viewModel)
            
            } else {
                ProgressView()
            }
        }.alert(isPresented: $viewModel.showAlert, content: {
            Alert(title: Text(viewModel.alertContent))
        })
    }
}

struct SegmentedControlView: View {
    @StateObject var viewModel: MainViewModel
    
    var body: some View {
        TabView {
            AccountView(viewModel: viewModel)
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("Account Details")
                }
            SignView(viewModel: viewModel)
                .tabItem {
                    Image(systemName: "mappin.circle.fill")
                    Text("Sign")
                }
            ContractInteractionView(viewModel: viewModel)
                .tabItem {
                    Image(systemName: "mappin.circle.fill")
                    Text("Smart Contract")
                }
        }
    }
}

#Preview {
    HomeView(viewModel: MainViewModel())
}
