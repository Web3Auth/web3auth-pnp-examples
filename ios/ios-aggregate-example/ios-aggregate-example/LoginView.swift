import SwiftUI

struct LoginView: View {
    @StateObject var vm: ViewModel
    var body: some View {
        List {
            Button(
                action: {
                    vm.loginWithGoogle()
                },
                label: {
                    Text("Sign In With Google")
                }
            )
            Button(
                action: {
                    vm.loginWithGitHub()
                },
                label: {
                    Text("Sign In With GitHub")
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
