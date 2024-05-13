package com.example.android_playground.ui.presentation

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import com.google.accompanist.pager.PagerState
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
import com.example.android_playground.utils.MinimalDialog
import com.example.android_playground.utils.Tabs
import com.example.android_playground.viewmodel.MainViewModel
import com.google.accompanist.pager.ExperimentalPagerApi
import com.google.accompanist.pager.HorizontalPager
import com.google.accompanist.pager.rememberPagerState

@OptIn(ExperimentalPagerApi::class)
@Composable
fun SmartContractsScreen(viewModel: MainViewModel) {
    val pagerState = rememberPagerState( 0)
    val tabItems = listOf(
        "Read from Contract",
        "Write from Contract",
    )

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Smart Contract Interactions", style = Typography.headlineLarge,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))
        Tabs(pagerState = pagerState, tabItems)
        Spacer(modifier = Modifier.height(16.dp))
        ContractTabsContent(pagerState = pagerState, viewModel)
    }
}


@Composable
@OptIn(ExperimentalPagerApi::class)
fun ContractTabsContent(pagerState: PagerState, viewModel: MainViewModel) {
    HorizontalPager(state = pagerState, count =  2) {
            page ->
        when (page) {
            0 -> ReadContractView(viewModel = viewModel)
            1 -> WriteContractView(viewModel = viewModel)
        }
    }
}

@Composable
fun ReadContractView(viewModel: MainViewModel) {
    var contractAddressText by remember { mutableStateOf("") }
    val openAlertDialog = remember { mutableStateOf(false) }
    var dialogText by remember { mutableStateOf("") }

    when {
        openAlertDialog.value -> MinimalDialog(dialogText) {
            openAlertDialog.value = false
        }
    }

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(horizontal = 16.dp)) {
        OutlinedTextField(
            value = contractAddressText,
            onValueChange = { contractAddressText = it },
            Modifier
                .fillMaxWidth()
                .padding(4.dp),
            label = { Text("ERC 20 Contract Address") }
        )

        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = {
            viewModel.getTokenBalance(contractAddressText, onSuccess = {
                balance, error ->
                if(balance != null) {
                    dialogText = "Balance:\n$balance"
                    openAlertDialog.value = true
                } else {
                    dialogText = "Error:\n$error"
                    openAlertDialog.value = true
                }
            })
        }, shape = RoundedCornerShape(4.dp), modifier = Modifier.fillMaxWidth()) {
            Text("Fetch Balance")
        }
    }
}

@Composable
fun WriteContractView(viewModel: MainViewModel) {
    var contractAddressText by remember { mutableStateOf("") }
    var spenderAddressText by remember { mutableStateOf("") }
    val openAlertDialog = remember { mutableStateOf(false) }
    var dialogText by remember { mutableStateOf("") }

    when {
        openAlertDialog.value -> MinimalDialog(dialogText) {
            openAlertDialog.value = false
        }
    }

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(horizontal = 16.dp)) {
        OutlinedTextField(
            value = contractAddressText,
            onValueChange = { contractAddressText = it },
            Modifier
                .fillMaxWidth()
                .padding(4.dp),
            label = { Text("ERC 20 Contract Address") }
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = spenderAddressText,
            onValueChange = { spenderAddressText = it },
            Modifier
                .fillMaxWidth()
                .padding(4.dp),
            label = { Text("Spender Address") }
        )

        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = {
            viewModel.revokeApproval(contractAddressText, spenderAddressText, onRevoke = {
                hash, error ->
                if(hash != null) {
                    dialogText = "Hash:\n$hash"
                    openAlertDialog.value = true
                } else {
                    dialogText = "Error:\n$error"
                    openAlertDialog.value = true
                }
            })
        }, shape = RoundedCornerShape(4.dp), modifier = Modifier.fillMaxWidth()) {
            Text("Revoke Approval")
        }

    }
}