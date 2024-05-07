package com.example.android_playground.data

import com.example.android_playground.domain.EthereumUseCase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.web3j.contracts.token.ERC20Interface
import org.web3j.crypto.Credentials
import org.web3j.crypto.RawTransaction
import org.web3j.crypto.Sign
import org.web3j.crypto.TransactionEncoder
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameterName
import org.web3j.protocol.core.methods.response.EthChainId
import org.web3j.protocol.core.methods.response.EthGetTransactionCount
import org.web3j.protocol.core.methods.response.EthSendTransaction
import org.web3j.utils.Convert
import org.web3j.utils.Numeric
import java.math.BigDecimal
import java.math.BigInteger
import java.text.DecimalFormat


class EthereumUseCaseImpl(
    private val web3: Web3j
) : EthereumUseCase {
    override suspend fun getBalance(publicKey: String): String = withContext(Dispatchers.IO) {
        try {
            val balanceResponse = web3.ethGetBalance(publicKey, DefaultBlockParameterName.LATEST).send()
            val ethBalance = BigDecimal.valueOf(balanceResponse.balance.toDouble()).divide(BigDecimal.TEN.pow(18))
            DecimalFormat("#,##0.00000").format(ethBalance)
        } catch (e: Exception) {
            throw e
        }
    }

    override suspend fun signMessage(message: String, sender: Credentials): String {
        try {
            val signature = Sign.signPrefixedMessage(message.toByteArray(), sender.ecKeyPair)
            val r = Numeric.toHexString(signature.r)
            val s = Numeric.toHexString(signature.s).substring(2)
            val v = Numeric.toHexString(signature.v).substring(2)

            return StringBuilder(r).append(s).append(v).toString()
        } catch (e: Exception) {
            throw e
        }
    }

    override suspend fun sendETH(amount: String, recipientAddress: String, sender: Credentials): String {
        try {


            val ethGetTransactionCount: EthGetTransactionCount =
                web3.ethGetTransactionCount(sender.address, DefaultBlockParameterName.LATEST)
                    .sendAsync().get()
            val nonce: BigInteger = ethGetTransactionCount.transactionCount
            val value: BigInteger = Convert.toWei(amount, Convert.Unit.ETHER).toBigInteger()
            val gasLimit: BigInteger = BigInteger.valueOf(21000)
            val gasPrice = web3.ethGasPrice().sendAsync().get()


            val rawTransaction: RawTransaction = RawTransaction.createEtherTransaction(
                nonce,
                gasPrice.gasPrice,
                gasLimit,
                recipientAddress,
                value
            )

            val signedMessage: ByteArray = TransactionEncoder.signMessage(rawTransaction, sender)
            val hexValue: String = Numeric.toHexString(signedMessage)
            val ethSendTransaction: EthSendTransaction =
                web3.ethSendRawTransaction(hexValue).sendAsync().get()

            if (ethSendTransaction.error != null) {
                throw Exception(ethSendTransaction.error.message)
            } else {
                return ethSendTransaction.transactionHash
            }
        } catch (e: Exception) {
            throw e
        }
    }

    override suspend fun readContract(contractAddress: String): String {
        ERC20Interface.
    }

}