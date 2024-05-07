package com.example.android_playground.ui.presentation


import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.android_playground.viewmodel.MainViewModel

@Composable
fun LoginScreen(viewModel: MainViewModel) {
    val context = LocalContext.current
    var text by remember { mutableStateOf("") }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "Web3Auth Android Playground",
            textAlign = TextAlign.Center,
            style = MaterialTheme.typography.headlineSmall
        )
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            Modifier.fillMaxWidth().padding(4.dp),
            label = { Text("Your email address") }
        )

        LoginButton {
            try {
                Log.d("Email", text)
                viewModel.login(email = text)
            } catch (e: Exception) {
                Toast.makeText(context, e.localizedMessage, Toast.LENGTH_LONG).show()
            }
        }
    }
}

@Composable
fun LoginButton(onClick: () -> Unit) {
    Button(onClick = { onClick() }, shape = RoundedCornerShape(4.dp)) {
        Text("Login with Email Passwordless")
    }
}
