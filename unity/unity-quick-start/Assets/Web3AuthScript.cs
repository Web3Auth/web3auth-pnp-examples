using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Newtonsoft.Json;
using TMPro;
using Nethereum.Web3;
using Nethereum.Util;
using Nethereum.Signer;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.ABI.Encoders;
using Nethereum.Hex.HexTypes;
using Nethereum.Web3.Accounts;
using Nethereum.Web3.Accounts.Managed;

public class Web3AuthScript : MonoBehaviour
{
    Web3Auth web3Auth;
    public TextMeshProUGUI console;
    private string userEmail = "";
    private string privateKey;
    private string userInfo;
    private Account account;
    Web3 web3;
    const string rpcURL = "https://rpc.ankr.com/eth";

    // Start is called before the first frame update
    void Start()
    {
        // IMP START - Quick Start
        web3Auth = GetComponent<Web3Auth>();
        // IMP END - Quick Start

        // IMP START - SDK Initialization
        // IMP START - Dashboard Registration
        var clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // Get your Web3Auth Client ID on https://dashboard.web3auth.io
        // IMP END - Dashboard Registration

        web3Auth.setOptions(new Web3AuthOptions()
        {
            clientId = clientId,
            redirectUrl = new System.Uri("w3aexample://com.web3auth.unityexample/auth"),
            network = Web3Auth.Network.SAPPHIRE_MAINNET,
        });
        // IMP END - SDK Initialization
        web3Auth.onLogin += onLogin;
        web3Auth.onLogout += onLogout;
        web3 = new Web3(rpcURL);
        updateConsole("Ready to Login!");
    }

    public void GrabEmailFromInputField(string input)
    {
        userEmail = input;
    }

    public void login()
    {
        if (userEmail == "")
        {
            Debug.Log("Please enter your email.");
            updateConsole("Please enter your email.");
            return;
        }
        // IMP START - Login
        var selectedProvider = Provider.EMAIL_PASSWORDLESS;

        var options = new LoginParams()
        {
            loginProvider = selectedProvider,
            extraLoginOptions = new ExtraLoginOptions()
            {
                login_hint = userEmail
            }
        };

        web3Auth.login(options);
        // IMP END - Login
    }

    private void onLogin(Web3AuthResponse response)
    {
        // IMP START - Get User Information
        userInfo = JsonConvert.SerializeObject(response.userInfo, Formatting.Indented);
        // IMP END - Get User Information
        // IMP START - Blockchain Calls
        privateKey = response.privKey;
        var newAccount = new Account(privateKey);
        account = newAccount;
        // IMP END - Blockchain Calls

        Debug.Log(JsonConvert.SerializeObject(response, Formatting.Indented));
        updateConsole(JsonConvert.SerializeObject(response, Formatting.Indented));
    }

    public void getUserInfo()
    {
        if (account == null)
        {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        Debug.Log(userInfo);
        updateConsole(userInfo);
    }

    public void logout()
    {
        // IMP START - Logout
        web3Auth.logout();
        // IMP END - Logout
    }

    private void onLogout()
    {
        privateKey = null;
        userInfo = null;
        account = null;

        Debug.Log("Logged out!");
        updateConsole("Logged out!");
    }

    // IMP START - Blockchain Calls
    public void getAccount()
    {
        if (account == null)
        {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        Debug.Log(account.Address);
        updateConsole(account.Address);
    }

    public void getBalance()
    {
        if (account == null)
        {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        var balance = web3.Eth.GetBalance.SendRequestAsync(account.Address).Result.Value;

        Debug.Log(balance);
        updateConsole(balance.ToString());
    }

    public void signMessage()
    {
        if (account == null)
        {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        var msg = "wee test message 18/09/2017 02:55PM";
        var signer = new EthereumMessageSigner();
        var signature = signer.EncodeUTF8AndSign(msg, new EthECKey(privateKey));

        Debug.Log(signature);
        updateConsole(signature.ToString());
    }
    // IMP END - Blockchain Calls

    public void updateConsole(string message)
    {
        console.text = message;
    }

    // Update is called once per frame
    void Update()
    {

    }
}