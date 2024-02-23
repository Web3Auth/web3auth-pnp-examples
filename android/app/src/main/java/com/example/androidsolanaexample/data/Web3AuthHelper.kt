package com.example.androidsolanaexample.data

import android.net.Uri
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.UserInfo
import com.web3auth.core.types.Web3AuthResponse
import java.util.concurrent.CompletableFuture

interface Web3AuthHelper {
    suspend fun login(loginParams: LoginParams): CompletableFuture<Web3AuthResponse>
    suspend fun logOut(): CompletableFuture<Void>
    fun getSolanaPrivateKey(): String

    suspend fun getUserInfo(): UserInfo
    suspend fun initialize(): CompletableFuture<Void>

    suspend fun setResultUrl(uri: Uri?): Unit
    suspend fun isUserAuthenticated(): Boolean
}