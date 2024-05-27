//
//  ios_aptos_exampleApp.swift
//  ios-aptos-example
//
//  Created by Ayush B on 24/05/24.
//

import SwiftUI

@main
struct ios_aptos_exampleApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: MainViewModel())
        }
    }
}
