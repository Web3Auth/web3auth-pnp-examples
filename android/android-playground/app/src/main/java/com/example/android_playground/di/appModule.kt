package com.example.android_playground.di

import android.content.Context
import android.net.Uri
import com.example.android_playground.data.EthereumUseCaseImpl
import com.example.android_playground.data.Web3AuthHelper
import com.example.android_playground.data.Web3AuthHelperImpl
import com.example.android_playground.domain.EthereumUseCase
import com.example.android_playground.utils.chainConfigList
import com.example.android_playground.viewmodel.MainViewModel
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.Network
import com.web3auth.core.types.Web3AuthOptions
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module
import org.web3j.protocol.Web3j
import org.web3j.protocol.http.HttpService

val appModule = module {
    single {
        getWeb3AuthHelper(get())
    }


    factory<EthereumUseCase> { EthereumUseCaseImpl(Web3j.build(HttpService(chainConfigList.first().rpcTarget))) }

    viewModel { MainViewModel(get()) }
}

private fun getWeb3AuthHelper(context: Context): Web3AuthHelper {
    val web3Auth = Web3Auth(
        Web3AuthOptions(
            clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
            network = Network.SAPPHIRE_MAINNET,
            redirectUrl = Uri.parse( "w3a://com.example.android_playground/auth")
        ), context.applicationContext
    )

    return Web3AuthHelperImpl(web3Auth)
}