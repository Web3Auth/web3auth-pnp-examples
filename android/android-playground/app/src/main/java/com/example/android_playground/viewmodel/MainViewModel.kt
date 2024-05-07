package com.example.android_playground.viewmodel

import android.net.Uri
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.android_playground.data.EthereumUseCaseImpl
import com.example.android_playground.data.Web3AuthHelper
import com.example.android_playground.domain.EthereumUseCase
import com.example.android_playground.utils.chainConfigList
import com.web3auth.core.types.ExtraLoginOptions
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.Provider
import com.web3auth.core.types.UserInfo
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.future.await
import kotlinx.coroutines.launch
import org.web3j.crypto.Credentials
import org.web3j.protocol.Web3j
import org.web3j.protocol.http.HttpService

@OptIn(ExperimentalStdlibApi::class)
class MainViewModel(private val web3AuthHelper: Web3AuthHelper) : ViewModel() {

    private val _isLoggedIn: MutableStateFlow<Boolean> = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn

    private val _isAccountLoaded: MutableStateFlow<Boolean> = MutableStateFlow(false)
    val isAccountLoaded: StateFlow<Boolean> = _isAccountLoaded

    private val _balance: MutableStateFlow<String> = MutableStateFlow("0.0")
    val balance: StateFlow<String> = _balance

    lateinit var credentials: Credentials
    lateinit var userInfo: UserInfo
    private var ethereumUseCase: EthereumUseCase = EthereumUseCaseImpl(
        Web3j.build(
            HttpService(
                chainConfigList.first().rpcTarget
            )
        )
    )

    fun privateKey(): String {
        return web3AuthHelper.getPrivateKey()
    }

    private fun prepareCredentials() {
        credentials = Credentials.create(privateKey())
    }

    private fun prepareUserInfo() {
        userInfo = web3AuthHelper.getUserInfo()
    }

    fun login(email: String) {
        val loginParams = LoginParams(
            loginProvider = Provider.EMAIL_PASSWORDLESS,
            extraLoginOptions = ExtraLoginOptions(login_hint = email)
        )
        viewModelScope.launch {
            try {
                web3AuthHelper.login(loginParams = loginParams).await()
                prepareCredentials()
                prepareUserInfo()
                _isLoggedIn.emit(true)
            } catch (error: Exception) {
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
                val isLoggedIn = web3AuthHelper.isUserAuthenticated()
                if (isLoggedIn) {
                    prepareCredentials()
                    prepareUserInfo()
                }
                _isLoggedIn.emit(isLoggedIn)
            } catch (e: Exception) {
                _isLoggedIn.emit(false)
            }
        }
    }

    fun getBalance() {
        viewModelScope.launch {
            _isAccountLoaded.emit(false)
            try {
                _balance.emit(ethereumUseCase.getBalance(credentials.address))
                _isAccountLoaded.emit(true)
            } catch (e: Exception) {
                _isAccountLoaded.emit(false)
                throw e
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

    fun sendTransaction(value: String, recipient: String, onSign: (hash: String?, error: String?) -> Unit) {
        viewModelScope.launch {
            try {
              val hash = ethereumUseCase.sendETH(value, recipient, credentials)
                onSign(hash, null)
            } catch (e: Exception) {
                e.localizedMessage?.let { onSign(null, it) }
            }
        }
    }

    fun signMessage(message: String, onSign: (hash: String?, error: String?) -> Unit) {
        viewModelScope.launch {
            try {
              val signature = ethereumUseCase.signMessage(message, credentials)
                Log.d("Signature", signature)
                onSign(signature, null)
            } catch (e: Exception) {
                e.localizedMessage?.let { onSign(null, it) }
            }
        }
    }

    fun userInfo(onAvailable: (userInfo: UserInfo?, error: String?) -> Unit) {
        try {
            val info = web3AuthHelper.getUserInfo()
            onAvailable(info, null)
        } catch (e: Exception) {
            e.localizedMessage?.let { onAvailable(null, it) }
        }
    }
}