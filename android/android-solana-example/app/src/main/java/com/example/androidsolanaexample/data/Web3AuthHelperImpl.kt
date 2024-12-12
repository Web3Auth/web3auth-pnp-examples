package com.example.androidsolanaexample.data

import android.net.Uri
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.UserInfo
import com.web3auth.core.types.Web3AuthResponse
import java.util.concurrent.CompletableFuture

class Web3AuthHelperImpl(
    private val web3Auth: Web3Auth
): Web3AuthHelper {
    override suspend fun login(loginParams: LoginParams): CompletableFuture<Web3AuthResponse> {
       return web3Auth.login(loginParams)
    }

    override suspend fun logOut(): CompletableFuture<Void> {
        return web3Auth.logout()
    }

    override fun getSolanaPrivateKey(): String {
        return web3Auth.getEd25519PrivKey()
    }

    override fun getUserInfo(): UserInfo {
      try {
          return web3Auth.getUserInfo()!!
      } catch (e: Exception) {
          throw e
      }
    }

    override suspend fun initialize(): CompletableFuture<Void> {
       try {
          return web3Auth.initialize()
       } catch(e: Exception) {
           // Something went wrong
           throw e
       }
    }

    override suspend fun setResultUrl(uri: Uri?) {
        return web3Auth.setResultUrl(uri)
    }

    override suspend fun isUserAuthenticated(): Boolean {
        return web3Auth.getPrivkey().isNotEmpty()
    }

}