import SwiftUI
import Web3Auth

struct ContentView: View {
    @StateObject var vm: ViewModel
    
    var body: some View {
        NavigationView {
            VStack {
                if vm.isLoading {
                    ProgressView()
                } else {
                    if vm.loggedIn,let user = vm.user, let web3rpc = Web3RPC(user: user) {
                        UserDetailView(
                            web3RPC: web3rpc, 
                            viewModel: vm
                        )
                    } else {
                        LoginView(vm: vm)
                    }
                }
            }
            .navigationTitle(vm.navigationTitle)
            Spacer()
        }
        .onAppear {
            Task {
                await vm.setup()
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(vm: ViewModel())
    }
}
