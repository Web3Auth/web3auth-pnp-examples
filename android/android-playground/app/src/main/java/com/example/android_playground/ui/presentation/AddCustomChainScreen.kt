package com.example.android_playground.ui.presentation

import androidx.compose.foundation.gestures.scrollable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.android_playground.ui.theme.Typography
import com.example.android_playground.viewmodel.MainViewModel
import com.web3auth.core.types.ChainConfig
import com.web3auth.core.types.ChainNamespace


@Composable
fun AddCustomChainScreen(viewModel: MainViewModel, onChainAdd: (ChainConfig) -> Unit) {
    var displayNameText by remember { mutableStateOf("") }
    var tickerNameText by remember { mutableStateOf("") }
    var tickerText by remember { mutableStateOf("") }
    var rpcTargetText by remember { mutableStateOf("") }
    var blockExplorerText by remember { mutableStateOf("") }
    var chainId by remember { mutableStateOf("") }

    LazyColumn(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier
        .fillMaxSize()
        .padding(horizontal = 16.dp)) {
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Add Custom Chain", style = Typography.headlineLarge,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = displayNameText,
                onValueChange = { displayNameText = it },
                Modifier
                    .fillMaxWidth()
                    .padding(4.dp),
                label = { Text("Blockchain Display Name") }
            )
            OutlinedTextField(
                value = chainId,
                onValueChange = { chainId = it },
                Modifier
                    .fillMaxWidth()
                    .padding(4.dp),
                label = { Text("Chain Id") }
            )
            OutlinedTextField(
                value = tickerText,
                onValueChange = { tickerText = it },
                Modifier
                    .fillMaxWidth()
                    .padding(4.dp),
                label = { Text("Ticker Symbol") }
            )
            OutlinedTextField(
                value = tickerNameText,
                onValueChange = { tickerNameText = it },
                Modifier
                    .fillMaxWidth()
                    .padding(4.dp),
                label = { Text("Ticker Name") }
            )
            OutlinedTextField(
                value = rpcTargetText,
                onValueChange = { rpcTargetText = it },
                Modifier
                    .fillMaxWidth()
                    .padding(4.dp),
                label = { Text("RPC Url") }
            )
            OutlinedTextField(
                value = blockExplorerText,
                onValueChange = { blockExplorerText = it },
                Modifier
                    .fillMaxWidth()
                    .padding(4.dp),
                label = { Text("Blockchain Explorer Url") }
            )

            Spacer(modifier = Modifier.height(24.dp))
            Button({
                val chainConfig = ChainConfig(
                    chainNamespace = ChainNamespace.EIP155,
                    decimals = 18,
                    blockExplorerUrl = blockExplorerText,
                    chainId = chainId,
                    displayName = displayNameText,
                    rpcTarget = rpcTargetText,
                    ticker = tickerText,
                    tickerName =tickerNameText
                )
                onChainAdd(chainConfig)
            }, shape = RoundedCornerShape(4.dp), modifier = Modifier.fillMaxWidth()) {
                Text("Add Chain")
            }
        }
    }
}