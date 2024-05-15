package com.example.androidsolanaexample.ui.presentation

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun UserInfoDialog( onDismissRequest: () -> Unit,  userInfo: String) {
    Log.d("UserInfo", userInfo)
    val scrollState = rememberScrollState()
    Dialog(onDismissRequest = {onDismissRequest()}) {
        Column(modifier = Modifier.background(Color.White)) {
            FlowRow(
                modifier = Modifier
                    .align(Alignment.End)
                    .padding(horizontal = 4.dp, vertical = 16.dp)
            ) {
                TextButton(onClick = { onDismissRequest() }) {
                    Text("Close")
                }
            }
            FlowRow(
                modifier = Modifier
                    .verticalScroll(scrollState)
                    .weight(1f).padding(horizontal = 8.dp)
            ) {
                Text(text = userInfo)
            }
        }
    }
}