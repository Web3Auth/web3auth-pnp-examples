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
    private string privateKey;
    private string userInfo;
    private Account account;
    Web3 web3;
    const string rpcURL = "https://rpc.ankr.com/eth";

    // Start is called before the first frame update
    void Start()
    {
        var loginConfigItem = new LoginConfigItem()
        {
            verifier = "web3auth-auth0-demo", // get it from web3auth dashboard
            typeOfLogin = TypeOfLogin.JWT,
            clientId = "294QRkchfq2YaXUbPri7D6PH7xzHgQMT", // auth0's client id
        };

        web3Auth = GetComponent<Web3Auth>();
        
        web3Auth.setOptions(new Web3AuthOptions()
        {
            clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk",
            redirectUrl = new System.Uri("torusapp://com.torus.Web3AuthUnity/auth"),
            network = Web3Auth.Network.CYAN,
            loginConfig = new Dictionary<string, LoginConfigItem>
            {
                {"jwt", loginConfigItem}
            }
            
        });
        web3Auth.onLogin += onLogin;
        web3Auth.onLogout += onLogout;
        web3 = new Web3(rpcURL);
        updateConsole("Ready to Login!");
    }

    public void login()
    {
        var selectedProvider = Provider.JWT;

        var options = new LoginParams()
        {
            loginProvider = selectedProvider,
            redirectUrl = new System.Uri("torusapp://com.torus.Web3AuthUnity/auth"),
            extraLoginOptions = new ExtraLoginOptions()
            {
                domain = "https://shahbaz-torus.us.auth0.com/",
                verifierIdField = "sub",
                prompt = Prompt.LOGIN,
            }
        };

        web3Auth.login(options);
    }

    private void onLogin(Web3AuthResponse response)
    {
        userInfo = JsonConvert.SerializeObject(response.userInfo, Formatting.Indented);
        privateKey = response.privKey;
        var newAccount = new Account(privateKey);
        account = newAccount;

        Debug.Log(JsonConvert.SerializeObject(response, Formatting.Indented));
        updateConsole(JsonConvert.SerializeObject(response, Formatting.Indented));
    }

    public void getUserInfo() {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        Debug.Log(userInfo);
        updateConsole(userInfo);
    }

    public void getPrivateKey() {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        Debug.Log(privateKey);
        updateConsole(privateKey);
    }

    public void logout()
    {
        web3Auth.logout();
    }

    private void onLogout()
    {
        privateKey = null;
        userInfo = null;
        account = null;

        Debug.Log("Logged out!");
        updateConsole("Logged out!");
    }

    public void getAccount() {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        Debug.Log(account.Address);
        updateConsole(account.Address);
    }

    public void getBalance() {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        var balance = web3.Eth.GetBalance.SendRequestAsync(account.Address).Result.Value;
        
        Debug.Log(balance);
        updateConsole(balance.ToString());
    }

    public async void getChainId() {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        var chainId = await web3.Net.Version.SendRequestAsync();
        
        Debug.Log(chainId);
        updateConsole(chainId.ToString());
    }

    public async void sendTransaction() {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        var toAddress = "0x2E464670992574A613f10F7682D5057fB507Cc21";
        var transaction = await web3.TransactionManager.SendTransactionAsync(account.Address, toAddress, new Nethereum.Hex.HexTypes.HexBigInteger(1));
        
        Debug.Log(transaction);
        updateConsole(transaction.ToString());
    }

    public void signMessage() {
        if (account == null) {
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

    public void updateConsole(string message){
        console.text = message;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}