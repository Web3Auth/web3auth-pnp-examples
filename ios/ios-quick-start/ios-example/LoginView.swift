import SwiftUI
import BigInt
import Foundation
import web3

struct LoginView: View {
    @StateObject var vm: ViewModel
    @State private var emailInput: String = ""

    var body: some View {
        VStack {
            Spacer()
            
            Text("Web3Auth iOS QuickStart")
                                .font(.title) // Adjust the font size as needed
                                .fontWeight(.bold)
                                .padding(.bottom, 20)

            TextField("Enter your email", text: $emailInput)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
                .padding(.horizontal, 10)

            Button(
                action: {
                    vm.loginEmailPasswordless(provider: .EMAIL_PASSWORDLESS, email: emailInput)
                },
                label: {
                    Text("Sign In with Email Passwordless")
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(8)
                }
            )
            .padding(.horizontal, 20)
            .padding(.bottom, 20)

            HStack {
                Rectangle()
                    .fill(Color.gray)
                    .frame(height: 1)

                Text("or")
                    .foregroundColor(.gray)
                    .padding(.horizontal, 10)

                Rectangle()
                    .fill(Color.gray)
                    .frame(height: 1)
            }
            .padding(.horizontal, 20)

            Button(
                action: {
                    vm.login(provider: .GOOGLE)
                },
                label: {
                    Text("Sign In with Google")
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.red) // Change color as needed
                        .cornerRadius(8)
                }
            )
            .padding(.horizontal, 20)
            .padding(.bottom, 10)

            Button(
                action: {
                    vm.login(provider: .APPLE)
                },
                label: {
                    Text("Sign In with Apple")
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.black) // Change color as needed
                        .cornerRadius(8)
                }
            )
            .padding(.horizontal, 20)

            Spacer()
        }
        .background(Color.white.edgesIgnoringSafeArea(.all))
    }
}


struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView(vm: ViewModel())
    }
}

public typealias Ether = Double
public typealias Wei = BigUInt

public final class Web3AuthWeb3Utils {
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

