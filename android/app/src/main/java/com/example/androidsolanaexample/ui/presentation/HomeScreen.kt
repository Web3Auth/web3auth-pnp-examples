package com.example.androidsolanaexample.ui.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.androidsolanaexample.viewmodel.MainViewModel

@Composable
fun HomeScreen(viewModel: MainViewModel) {
    val openDialog = remember { mutableStateOf(false) }
    val dialogContent = remember {
        mutableStateOf("")
    }

    val openUserInfoDialog = remember {
        mutableStateOf(false)
    }
    val userInfo = remember {
        mutableStateOf("")
    }

    val isAccountLoaded = viewModel.isAccountLoaded.collectAsState()
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(16.dp, alignment = Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        if (isAccountLoaded.value) {
            Text(text = viewModel.balance, style = MaterialTheme.typography.displaySmall)
        } else {
            Box(modifier = Modifier.height(48.dp)) {
                CircularProgressIndicator()
            }
        }

        Text(
            text = "Solana Devnet\nRequest the faucet on faucet.solana.com",
            style = MaterialTheme.typography.bodyLarge, textAlign = TextAlign.Center
        )

        VerticalSpacer()

        SignAndSolanaTransactionButton{
            viewModel.signAndSendTransaction{ result, error ->
                if(result != null) {
                    dialogContent.value = result
                    viewModel.getBalance()
                } else {
                    dialogContent.value = error!!
                }

                openDialog.value = true
            }
        }

        SignSolanaTransactionButton{
            viewModel.signTransaction{ result, error ->
                if(result != null) {
                    dialogContent.value = result
                } else {
                    dialogContent.value = error!!
                }

                openDialog.value = true
            }
        }

        GetPrivateKeyButton{
            openDialog.value = true
            dialogContent.value =  viewModel.solanaKeyPair.publicKey.toBase58()
        }

        GetUserInfoButton {
            viewModel.userInfo{ result, error ->
                if(result != null) {
                    userInfo.value = result.toString()
                } else {
                    userInfo.value = error!!
                }

                openUserInfoDialog.value = true
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

    if(openUserInfoDialog.value) {
        UserInfoDialog(onDismissRequest = {
            openUserInfoDialog.value = false
        }, userInfo = userInfo.value)
    }

}

@Composable
fun GetUserInfoButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text(text = "Get User Info")
    }
}

@Composable
fun GetPrivateKeyButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Show Private Key")
    }
}

@Composable
fun VerticalSpacer() {
    Box(modifier = Modifier.height(16.dp))
}

@Composable
fun SignSolanaTransactionButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Sign Self Transfer 0.01 Sol")
    }
}

@Composable
fun SignAndSolanaTransactionButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Self transfer 0.01 Sol")
    }
}
@Composable
fun LogOutButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Log out")
    }
}