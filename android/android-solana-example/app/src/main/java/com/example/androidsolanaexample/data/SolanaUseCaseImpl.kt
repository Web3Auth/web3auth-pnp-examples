package com.example.androidsolanaexample.data

import com.example.androidsolanaexample.domain.SolanaUseCase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Runnable
import kotlinx.coroutines.withContext
import org.sol4k.Base58
import org.sol4k.Connection
import org.sol4k.Keypair
import org.sol4k.PublicKey
import org.sol4k.Transaction
import org.sol4k.instruction.TransferInstruction
import java.math.BigDecimal
import java.math.BigInteger
import kotlin.math.pow

class SolanaUseCaseImpl(
    private val connection: Connection
) : SolanaUseCase {
    override suspend fun getBalance(publicKey: PublicKey): String = withContext(Dispatchers.IO) {
       try {
           val balanceResponse = connection.getBalance(publicKey).toBigDecimal()
           balanceResponse.divide(BigDecimal.TEN.pow(9)).toString()
       } catch (e: Exception) {
           throw e
       }
    }

    override suspend fun signAndSendSol(sender: Keypair): String = withContext(Dispatchers.IO) {
        try {
            val transaction = prepareSignedTransaction(sender)
            connection.sendTransaction(transaction = transaction)
        } catch (e:Exception) {
            throw e
        }
    }

    override suspend fun signSendSol(sender: Keypair): String = withContext(Dispatchers.IO) {
        try {
           val transaction = prepareSignedTransaction(sender)
           Base58.encode(transaction.serialize())
        } catch (e: Exception) {
            throw e
        }
    }

    private suspend fun prepareSignedTransaction(sender: Keypair) : Transaction = withContext(Dispatchers.IO) {
       try {
           val blockHash = connection.getLatestBlockhash()
           val instruction = TransferInstruction(sender.publicKey, sender.publicKey, lamports = 10000000)
           val transaction = Transaction(blockHash, instruction, feePayer = sender.publicKey)
           transaction.sign(sender)
           transaction
       }catch (e: Exception) {
           throw e
       }
    }

}