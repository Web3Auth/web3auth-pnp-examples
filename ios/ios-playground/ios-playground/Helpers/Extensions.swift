//
//  Extensions.swift
//  ios-playground
//
//  Created by Ayush B on 26/04/24.
//

import Foundation

extension String {
    public func addressAbbreivation() -> String {
        return self.prefix(6) + "..." + self.suffix(6)
    }
}
