package com.example.android_playground.ui.presentation

import android.content.Context
import android.util.Log
import android.widget.Toast
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
import com.google.accompanist.pager.rememberPagerState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.android_playground.ui.theme.Typography
import com.example.android_playground.utils.MinimalDialog
import com.example.android_playground.utils.Tabs
import com.example.android_playground.viewmodel.MainViewModel
import com.google.accompanist.pager.ExperimentalPagerApi
import com.google.accompanist.pager.HorizontalPager

@OptIn(ExperimentalPagerApi::class)
@Composable
fun TransactionScreen(viewModel: MainViewModel) {
    val pagerState = rememberPagerState( 0)
    val tabItems = listOf(
        "Sign Message",
        "Send Transaction",
    )

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Signing/Transaction", style = Typography.headlineLarge,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))
        Tabs(pagerState = pagerState, tabItems)
        Spacer(modifier = Modifier.height(16.dp))
        TabsContent(pagerState = pagerState, viewModel)
    }
}

@OptIn(ExperimentalPagerApi::class)
@Composable
fun TabsContent(pagerState: PagerState, viewModel: MainViewModel) {

    HorizontalPager(state = pagerState, count =  2) {
        page ->
        when (page) {
            0 -> SigningView(viewModel = viewModel)
            1 -> TransactionView(viewModel = viewModel)
        }
    }
}

@Composable
fun SigningView(viewModel: MainViewModel) {
    var messageText by remember { mutableStateOf("Welcome to Web3Auth") }
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
            value = messageText,
            onValueChange = { messageText = it },
            Modifier
                .fillMaxWidth()
                .padding(4.dp),
            label = { Text("Message to sign") }
        )

        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = {
            viewModel.signMessage(messageText, onSign = {
                signature, error ->
                if(signature != null) {
                   dialogText = "Signature:\n$signature"
                    openAlertDialog.value = true
                } else {
                    dialogText = "Error:\n$error"
                    openAlertDialog.value = true

                }
            })
        }, shape = RoundedCornerShape(4.dp), modifier = Modifier.fillMaxWidth()) {
            Text("Sign Message")
        }

    }
}


@Composable
fun TransactionView(viewModel: MainViewModel) {
    var valueText by remember { mutableStateOf("") }
    var addressText by remember { mutableStateOf("") }
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
            value = valueText,
            onValueChange = { valueText= it },
            Modifier
                .fillMaxWidth()
                .padding(4.dp),
            label = { Text("ETH amount") }
        )

        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = addressText,
            onValueChange = { addressText= it },
            Modifier
                .fillMaxWidth()
                .padding(4.dp),
            label = { Text("Recipient address") }
        )
        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = {
            viewModel.sendTransaction(valueText, addressText, onSign = {
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
            Text("Send transaction")
        }
    }
}