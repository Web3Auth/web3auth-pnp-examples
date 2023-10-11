import SwiftUI

struct LoginView: View {
    @StateObject var vm: ViewModel
    var body: some View {
        List {

            Button(
                action: {
                    vm.login(provider: .GOOGLE)
                },
                label: {
                    Text("Sign In with Google")
                }
            )

            Button(
                action: {
                    vm.login(provider: .APPLE)
                },
                label: {
                    Text("Sign In with Apple")
                }
            )
            
            Button(
                action: {
                    vm.login(provider: .DISCORD)
                },
                label: {
                    Text("Sign In with Discord")
                }
            )
            
            Button(
                action: {
                    vm.loginEmailPasswordless(provider: .EMAIL_PASSWORDLESS)
                },
                label: {
                    Text("Sign In with Email Passwordless")
                }
            )
            
            Button(
                action: {
                    vm.whitelabelLogin()
                },
                label: {
                    Text("Sign In (Whitelabel example)")
                }
            )
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView(vm: ViewModel())
    }
}
