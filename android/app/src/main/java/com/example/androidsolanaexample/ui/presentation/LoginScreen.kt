package com.example.androidsolanaexample.ui.presentation

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.example.androidsolanaexample.viewmodel.MainViewModel

@Composable
fun LoginScreen(viewModel: MainViewModel) {
    val context = LocalContext.current
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Android Solana Example")
        LoginButton {
            try {
                viewModel.login()
            } catch (e: Exception) {
                Toast.makeText(context, e.localizedMessage, Toast.LENGTH_LONG).show()
            }
        }
    }
}

@Composable
fun LoginButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }) {
        Text("Login")
    }
}
