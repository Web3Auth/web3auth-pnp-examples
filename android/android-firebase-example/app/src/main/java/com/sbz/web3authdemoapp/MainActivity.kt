package com.sbz.web3authdemoapp

import android.content.ContentValues.TAG
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.google.gson.Gson
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.*
import java.util.concurrent.CompletableFuture


class MainActivity : AppCompatActivity() {

    private lateinit var web3Auth: Web3Auth

    private lateinit var auth: FirebaseAuth

    private val gson = Gson()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        web3Auth = Web3Auth(
           Web3AuthOptions(
               context = this,
               clientId = getString(R.string.web3auth_project_id), // pass over your Web3Auth Client ID from Developer Dashboard
               network = Network.SAPPHIRE_MAINNET, // pass over the network you want to use (MAINNET or TESTNET or CYAN, AQUA, SAPPHIRE_MAINNET or SAPPHIRE_TESTNET)
               buildEnv = BuildEnv.PRODUCTION,
               redirectUrl = Uri.parse("com.sbz.web3authdemoapp://auth"), // your app's redirect URL
               // Optional parameters
               whiteLabel = WhiteLabelData(
                   "Web3Auth Android FireBase Example",
                   null,
                   "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                   "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                   Language.EN,
                   ThemeModes.LIGHT,
                   true,
                   hashMapOf(
                       "primary" to "#eb5424"
                   )
               ),
               mfaSettings = MfaSettings(
                   deviceShareFactor = MfaSetting(true, 1, true),
                   socialBackupFactor = MfaSetting(true, 2, false),
                   passwordFactor = MfaSetting(true, 3, false),
                   backUpShareFactor = MfaSetting(true, 4, false),
               ),
               loginConfig = hashMapOf("jwt" to LoginConfigItem(
                   verifier = "w3a-firebase-demo",
                   typeOfLogin = TypeOfLogin.JWT,
                   name = "Firebase login",
                   clientId = getString(R.string.web3auth_project_id)
               ))
           )
       )

        // Handle user signing in when app is not alive
        web3Auth.setResultUrl(intent?.data)

        // Call initialize() in onCreate() to check for any existing session.
        val sessionResponse: CompletableFuture<Void> = web3Auth.initialize()
        sessionResponse.whenComplete { _, error ->
            if (error == null) {
                reRender()
                println("PrivKey: " + web3Auth.getPrivkey())
                println("ed25519PrivKey: " + web3Auth.getEd25519PrivKey())
                println("Web3Auth UserInfo" + web3Auth.getUserInfo())
            } else {
                Log.d("MainActivity_Web3Auth", error.message ?: "Something went wrong")
                // Ideally, you should initiate the login function here.
            }
        }

        // Setup UI and event handlers
        val signInButton = findViewById<Button>(R.id.signInButton)
        signInButton.setOnClickListener { signIn() }

        val signOutButton = findViewById<Button>(R.id.signOutButton)
        signOutButton.setOnClickListener { signOut() }
        signOutButton.visibility = View.GONE
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)

        // Handle user signing in when app is active
        web3Auth.setResultUrl(intent?.data)
    }

    private fun signIn() {
        // Initialize Firebase Auth
        auth = Firebase.auth

        auth.signInWithEmailAndPassword("android@firebase.com", "Android@Web3Auth")
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // Sign in success, update UI with the signed-in user's information
                    Log.d(TAG, "signInWithEmail:success")
                    val user = auth.currentUser
                    user!!.getIdToken(true).addOnSuccessListener { result ->
                        val idToken = result.token
                        //Do whatever
                        Log.d(TAG, "GetTokenResult result = $idToken")
                        val selectedLoginProvider = Provider.JWT
                        val loginCompletableFuture: CompletableFuture<Web3AuthResponse> = web3Auth.login(LoginParams(selectedLoginProvider, extraLoginOptions = ExtraLoginOptions(domain= "firebase", id_token = idToken, verifierIdField = "email")))

                        loginCompletableFuture.whenComplete {  _, error ->
                            if (error == null) {
                                reRender()
                            } else {
                                Log.d("MainActivity_Web3Auth", error.message ?: "Something went wrong" )
                            }
                        }
                    }
                } else {
                    // If sign in fails, display a message to the user.
                    Log.w(TAG, "signInWithEmail:failure", task.exception)
                    Toast.makeText(baseContext, "Authentication failed.",
                        Toast.LENGTH_SHORT).show()

                }
            }

//        val selectedLoginProvider = Provider.JWT   // Can be GOOGLE, FACEBOOK, TWITCH etc.
//        val loginCompletableFuture: CompletableFuture<Web3AuthResponse> = web3Auth.login(LoginParams(selectedLoginProvider, extraLoginOptions = ExtraLoginOptions(domain = "firebase", id_token = "token")))

    //    For Email Passwordless, use the below code and pass email id into extraLoginOptions of LoginParams.
    //    val selectedLoginProvider = Provider.EMAIL_PASSWORDLESS
    //    val loginCompletableFuture: CompletableFuture<Web3AuthResponse> = web3Auth.login(LoginParams(selectedLoginProvider, extraLoginOptions = ExtraLoginOptions(login_hint = "shahbaz.web3@gmail.com")))

    //    For login with Custom JWT, use the below code and pass email id into extraLoginOptions of LoginParams.
    //    val selectedLoginProvider = Provider.JWT
    //    val loginCompletableFuture: CompletableFuture<Web3AuthResponse> = web3Auth.login(LoginParams(selectedLoginProvider, extraLoginOptions = ExtraLoginOptions(id_token = "<id-token>", domain: "your-domain")))

//        loginCompletableFuture.whenComplete { loginResponse, error ->
//            if (error == null) {
//                println(loginResponse)
//                reRender(loginResponse)
//            } else {
//                Log.d("MainActivity_Web3Auth", error.message ?: "Something went wrong" )
//            }
//        }
    }

    private fun signOut() {
        val logoutCompletableFuture =  web3Auth.logout()
        logoutCompletableFuture.whenComplete { _, error ->
            if (error == null) {
                reRender()
            } else {
                Log.d("MainActivity_Web3Auth", error.message ?: "Something went wrong" )
            }
        }
        recreate()
    }

    private fun reRender() {
        val contentTextView = findViewById<TextView>(R.id.contentTextView)
        val signInButton = findViewById<Button>(R.id.signInButton)
        val signOutButton = findViewById<Button>(R.id.signOutButton)
        var key: String? = null
        var userInfo: UserInfo? = null
        try {
            key = web3Auth.getPrivkey()
            userInfo = web3Auth.getUserInfo()
        } catch (ex: Exception) {
            print(ex)
        }
        println(userInfo)
        if (key is String && key.isNotEmpty()) {
            contentTextView.text = gson.toJson(userInfo) + "\n Private Key: " + key
            contentTextView.visibility = View.VISIBLE
            signInButton.visibility = View.GONE
            signOutButton.visibility = View.VISIBLE
        } else {
            contentTextView.text = getString(R.string.not_logged_in)
            contentTextView.visibility = View.GONE
            signInButton.visibility = View.VISIBLE
            signOutButton.visibility = View.GONE
        }
    }
}