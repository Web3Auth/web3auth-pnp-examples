//
//  ios_solana_exampleApp.swift
//  ios-solana-example
//
//  Created by Ayush B on 24/02/24.
//

import SwiftUI

@main
struct ios_solana_exampleApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: ViewModel())
        }
    }
}
