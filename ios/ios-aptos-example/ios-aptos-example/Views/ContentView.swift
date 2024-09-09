//
//  ContentView.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import SwiftUI

struct ContentView: View {
    @StateObject var viewModel: MainViewModel
      
      var body: some View {
          NavigationView {
              if viewModel.isUserAuthenticated {
                  HomeView(
                      viewModel: viewModel
                  )
              } else {
                  LoginView(viewModel: viewModel)
              }
          }.onAppear{
              viewModel.initialize()
          }
      }
}
