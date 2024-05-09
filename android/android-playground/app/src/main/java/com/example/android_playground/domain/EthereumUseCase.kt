package com.example.android_playground.domain

import org.web3j.crypto.Credentials

interface EthereumUseCase {
    suspend fun getBalance(publicKey: String): String
    suspend fun signMessage(message: String, sender: Credentials): String
    suspend fun sendETH(amount: String, recipientAddress: String, sender: Credentials): String

    suspend fun getBalanceOf(contractAddress: String, address: String, credentials: Credentials): String
    suspend fun approve(contractAddress: String, spenderAddress: String, credentials: Credentials): String
}