package com.example.androidsolanaexample.domain

import org.sol4k.Keypair
import org.sol4k.PublicKey
import org.sol4k.Transaction

interface SolanaUseCase {
    suspend fun getBalance(publicKey: PublicKey): String
    suspend fun signAndSendSol(sender: Keypair): String

    suspend fun signSendSol(sender: Keypair): String
}