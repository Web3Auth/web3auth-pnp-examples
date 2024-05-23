//
//  ios_playgroundApp.swift
//  ios-playground
//
//  Created by Ayush B on 25/04/24.
//

import SwiftUI

@main
struct ios_playgroundApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: MainViewModel())
        }
    }
}
