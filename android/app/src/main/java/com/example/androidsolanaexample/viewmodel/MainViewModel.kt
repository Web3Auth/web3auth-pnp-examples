package com.example.androidsolanaexample.viewmodel
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.androidsolanaexample.data.Web3AuthHelper
import com.example.androidsolanaexample.domain.SolanaUseCase
import com.web3auth.core.decodeBase64URLString
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.Provider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.future.await
import kotlinx.coroutines.launch
import org.sol4k.Base58
import org.sol4k.Keypair
import java.util.Base64

@OptIn(ExperimentalStdlibApi::class)
class MainViewModel(private val web3AuthHelper: Web3AuthHelper, private val solanaUseCase: SolanaUseCase): ViewModel() {

    private val _isLoggedIn: MutableStateFlow<Boolean> = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn

    private val _isAccountLoaded: MutableStateFlow<Boolean> = MutableStateFlow(false)
    val isAccountLoaded: StateFlow<Boolean> = _isAccountLoaded

    lateinit var solanaKeyPair: Keypair
    lateinit var balance: String

    fun solanaPrivateKey(): String {
        return web3AuthHelper.getSolanaPrivateKey()
    }

    fun prepareHotAccount() {
        solanaKeyPair = Keypair.fromSecretKey(solanaPrivateKey().hexToByteArray())
    }
    fun login(){
        val loginParams = LoginParams(loginProvider = Provider.GOOGLE)
        viewModelScope.launch {
            try {
                web3AuthHelper.login(loginParams = loginParams).await()
                prepareHotAccount()
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
                val isLoggedIn = web3AuthHelper.isUserAuthenticated()
                if(isLoggedIn) {
                    prepareHotAccount()
                }
                _isLoggedIn.emit(isLoggedIn)
            }  catch (e: Exception) {
                _isLoggedIn.emit(false)
            }
        }
    }

    fun getBalance() {
        viewModelScope.launch {
            _isAccountLoaded.emit(false)
            try {
                balance = solanaUseCase.getBalance(solanaKeyPair.publicKey)
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

     fun signAndSendTransaction(onSign: (hash: String?, error: String?) -> Unit) {
        viewModelScope.launch {
            try {
                val signedTransaction = solanaUseCase.signAndSendSol(solanaKeyPair)
                onSign(signedTransaction, null)
            } catch (e: Exception) {
                e.localizedMessage?.let { onSign( null, it) }
            }
        }
    }

    fun signTransaction(onSign: (signedTransaction: String?, error: String?) -> Unit) {
        viewModelScope.launch {
          try {
              val signedTransaction = solanaUseCase.signSendSol(solanaKeyPair)
              onSign(signedTransaction, null)
          } catch (e: Exception) {
              e.localizedMessage?.let { onSign( null, it) }
          }
        }
    }
}