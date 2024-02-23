package com.example.androidsolanaexample.ui.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.androidsolanaexample.viewmodel.MainViewModel

@Composable
fun HomeScreen(viewModel: MainViewModel) {
    val openDialog = remember { mutableStateOf(false) }
    val dialogContent = remember {
        mutableStateOf("")
    }

    val isAccountLoaded = viewModel.isAccountLoaded.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        if (isAccountLoaded.value) {
            Text(text = viewModel.balance)
        }

        GetPrivateKeyButton{
            openDialog.value = true
            dialogContent.value =  viewModel.solanaKeyPair.publicKey.toBase58()
        }

        SignSolanaTransactionButton{
            viewModel.signTransaction{
                    result, error ->
                if(result != null) {
                    dialogContent.value = result
                } else {
                    dialogContent.value = error!!
                }

                openDialog.value = true
            }
        }

        SignAndSolanaTransactionButton{
            viewModel.signAndSendTransaction{
                result, error ->
                if(result != null) {
                    dialogContent.value = result
                    viewModel.getBalance()
                } else {
                    dialogContent.value = error!!
                }

                openDialog.value = true
            }
        }

        LogOutButton {
            viewModel.logOut()

        }
    }

    if(openDialog.value) {
        MinimalDialog(onDismissRequest = {
            openDialog.value = false
        }, content = dialogContent.value)
    }

}

@Composable
fun GetPrivateKeyButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Get Private Key")
    }
}

@Composable
fun SignSolanaTransactionButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Sign Solana Transaction")
    }
}

@Composable
fun SignAndSolanaTransactionButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Send 0.01 Sol")
    }
}
@Composable
fun LogOutButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Log out")
    }
}