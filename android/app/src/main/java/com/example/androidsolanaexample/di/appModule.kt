package com.example.androidsolanaexample.di

import android.content.Context
import android.net.Uri
import com.example.androidsolanaexample.data.Web3AuthHelper
import com.example.androidsolanaexample.data.Web3AuthHelperImp
import com.example.androidsolanaexample.viewmodel.MainViewModel
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.Network
import com.web3auth.core.types.Web3AuthOptions
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module

val appModule = module {
    single {
        getWeb3AuthHelper(get())
    }

    viewModel { MainViewModel(get()) }
}

private fun getWeb3AuthHelper(context: Context): Web3AuthHelper {
    val web3Auth: Web3Auth = Web3Auth(
        Web3AuthOptions(
            clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
            context = context,
            network = Network.SAPPHIRE_MAINNET,
            redirectUrl = Uri.parse( "com.example.androidsolanaexample://auth")
        )
    )

    return Web3AuthHelperImp(web3Auth)
}