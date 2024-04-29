//
//  Error.swift
//  ios-playground
//
//  Created by Ayush B on 26/04/24.
//

import Foundation

public enum PlaygroundError: Error {
    case decodingError
    case customErr(String)
}
