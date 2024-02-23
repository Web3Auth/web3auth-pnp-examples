package com.example.androidsolanaexample.ui.presentation

import android.net.Uri
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.androidsolanaexample.data.Web3AuthHelper
import com.example.androidsolanaexample.utils.LoginState
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.Provider
import com.web3auth.core.types.Web3AuthResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.future.await
import kotlinx.coroutines.launch

class MainViewModel(private val web3AuthHelper: Web3AuthHelper): ViewModel() {

    private val _isLoggedIn: MutableStateFlow<Boolean> = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn

    fun login(){
        val loginParams = LoginParams(loginProvider = Provider.GOOGLE)
        viewModelScope.launch {
            try {
                web3AuthHelper.login(loginParams = loginParams).await()
                _isLoggedIn.emit(true)
            } catch (error: Exception){
                _isLoggedIn.emit(false)
                throw error
            }
        }
    }

    fun initialise() {
        viewModelScope.launch {
            web3AuthHelper.initialize().await()
            isUserLoggedIn()
        }
    }

    private fun isUserLoggedIn() {
        viewModelScope.launch {
            try {
                _isLoggedIn.emit(web3AuthHelper.isUserAuthenticated())
            }  catch (e: Exception) {
                _isLoggedIn.emit(false)
            }
        }
    }

    fun logOut() {
        viewModelScope.launch {
            try {
                web3AuthHelper.logOut().await()
                _isLoggedIn.emit(true)
            } catch (e: Exception) {
                _isLoggedIn.emit(false)
            }
        }
    }

    fun setResultUrl(uri: Uri?) {
        viewModelScope.launch {
            web3AuthHelper.setResultUrl(uri)
        }
    }
}