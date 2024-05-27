//
//  Extension.swift
//  ios-aptos-example
//
//  Created by Ayush B on 25/05/24.
//

import Foundation

extension String {
    func addressAbbreivation() -> String {
        let suffixAddress = self.suffix(6)
        let prefixAddress = self.prefix(6)
        return prefixAddress + "..." + suffixAddress
    }
}

extension Encodable {
    func toDictionary(_ encoder: JSONEncoder = JSONEncoder()) throws -> [String: Any] {
        let data = try encoder.encode(self)
        let object = try JSONSerialization.jsonObject(with: data)
        if let json = object as? [String: Any]  { return json }
        
        let context = DecodingError.Context(codingPath: [], debugDescription: "Deserialized object is not a dictionary")
        throw DecodingError.typeMismatch(type(of: object), context)
    }
}
