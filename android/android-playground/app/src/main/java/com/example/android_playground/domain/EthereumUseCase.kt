package com.example.android_playground.domain

import org.web3j.crypto.Credentials

interface EthereumUseCase {
    suspend fun getBalance(publicKey: String): String
    suspend fun signMessage(message: String, sender: Credentials): String
    suspend fun sendETH(amount: String, recipientAddress: String, sender: Credentials): String

    suspend fun readContract(contractAddress: String): String
}