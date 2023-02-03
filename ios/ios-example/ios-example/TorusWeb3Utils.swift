import BigInt
import Foundation
import web3

public typealias Ether = Double
public typealias Wei = BigUInt

public final class TorusWeb3Utils {
    public static func timeMinToSec(val: Double) -> Double {
        return val * 60
    }

    // NOTE: calculate wei by 10^18
    private static let etherInWei = pow(Double(10), 18)
    private static let etherInGwei = pow(Double(10), 9)

    /// Convert Wei(BInt) unit to Ether(Decimal) unit
    public static func toEther(wei: Wei) -> Ether {
        guard let decimalWei = Double(wei.description) else {
            return 0
        }
        return decimalWei / etherInWei
    }

    public static func toEther(Gwie: BigUInt) -> Ether {
        guard let decimalWei = Double(Gwie.description) else {
            return 0
        }
        return decimalWei / etherInGwei
    }

    /// Convert Ether(Decimal) unit to Wei(BInt) unit
    public static func toWei(ether: Ether) -> Wei {
        let wei = Wei(ether * etherInWei)
        return wei
    }

    /// Convert Ether(String) unit to Wei(BInt) unit
    public static func toWei(ether: String) -> Wei {
        guard let decimalEther = Double(ether) else {
            return 0
        }
        return toWei(ether: decimalEther)
    }

    // Only used for calcurating gas price and gas limit.
    public static func toWei(GWei: Double) -> Wei {
        return Wei(GWei * 1000000000)
    }
}

enum ConverterError: Error {
    case failed
}

extension String {
    func isValidEthAddress() -> Bool {
        let ethAddressRegex = "^0x[a-fA-F0-9]{40}$"
        let pred = NSPredicate(format: "SELF MATCHES %@", ethAddressRegex)
        return pred.evaluate(with: self)
    }

    func numberOfOccurrencesOf(string: String) -> Int {
        return components(separatedBy: string).count - 1
    }
}
