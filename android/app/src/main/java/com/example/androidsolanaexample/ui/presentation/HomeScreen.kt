package com.example.androidsolanaexample.ui.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        GetPrivateKeyButton{
            openDialog.value = true
            dialogContent.value =  viewModel.solanaKeyPair.publicKey.toBase58()
        }
        SignSolanaMessageButton{}
        SignSolanaTransactionButton{}
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
fun SignSolanaMessageButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Sign Solana Message")
    }
}
@Composable
fun LogOutButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Log out")
    }
}