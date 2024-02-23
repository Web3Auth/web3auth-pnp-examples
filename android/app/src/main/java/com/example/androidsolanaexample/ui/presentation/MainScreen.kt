package com.example.androidsolanaexample.ui.presentation

import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import com.example.androidsolanaexample.viewmodel.MainViewModel

@Composable
fun MainScreen(viewModel: MainViewModel) {
    val isUserLoggedInState = viewModel.isLoggedIn.collectAsState()
    Log.d("isUserLoggedInState", isUserLoggedInState.toString())
    if(isUserLoggedInState.value) {
        HomeScreen(viewModel = viewModel)
    } else {
        LoginScreen(viewModel = viewModel)
    }
}