using System;
using System.Collections.Generic;
using UnityEngine;
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
    const string rpcURL = "https://rpc.ankr.com/eth_sepolia";

    // Start is called before the first frame update
    void Start()
    {
        web3Auth = GetComponent<Web3Auth>();
        var auth0GitHubConfig = new LoginConfigItem()
        {
            verifier = "aggregate-sapphire",
            verifierSubIdentifier = "w3a-a0-github",
            clientId = "hiLqaop0amgzCC0AXo4w0rrG9abuJTdu",
            typeOfLogin = TypeOfLogin.JWT,
        };
        var auth0FacebookConfig = new LoginConfigItem()
        {
            verifier = "aggregate-sapphire",
            verifierSubIdentifier = "w3a-facebook",
            clientId = "1222658941886084",
            typeOfLogin = TypeOfLogin.FACEBOOK,
        };
        var googleConfig = new LoginConfigItem()
        {
            verifier = "aggregate-sapphire",
            verifierSubIdentifier = "w3a-google",
            clientId = "519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com",
            typeOfLogin = TypeOfLogin.GOOGLE,
        };
        web3Auth.setOptions(new Web3AuthOptions()
        {
            clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
            redirectUrl = new System.Uri("w3aexample://com.web3auth.unityaggregateexample"),
            network = Web3Auth.Network.SAPPHIRE_MAINNET,
            loginConfig = new Dictionary<string, LoginConfigItem>
            {
                { "github", auth0GitHubConfig },
                { "facebook", auth0FacebookConfig },
                {"google", googleConfig }
            }
        });
        web3Auth.onLogin += onLogin;
        web3Auth.onLogout += onLogout;
        web3Auth.onMFASetup += onMFASetup;

        updateConsole("Ready to Login!");
    }

    public void loginGoogle()
    {
        var selectedProvider = Provider.GOOGLE;

        var options = new LoginParams()
        {
            loginProvider = selectedProvider,
        };

        web3Auth.login(options);
    }

    public void loginFacebook()
    {
        var selectedProvider = Provider.FACEBOOK;

        var options = new LoginParams()
        {
            loginProvider = selectedProvider,      
        };

        web3Auth.login(options);
    }

    public void loginGitHub()
    {
        var selectedProvider = Provider.GITHUB;

        var options = new LoginParams()
        {
            loginProvider = selectedProvider,
            extraLoginOptions = new ExtraLoginOptions()
            {
                domain = "https://web3auth.au.auth0.com",
                verifierIdField = "email",
                isVerifierIdCaseSensitive = false,
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

        var rpc = new Nethereum.JsonRpc.Client.RpcClient(new Uri(rpcURL));
        web3 = new Web3(account, rpc);

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

    public async void getChainId() {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        try
        {
            var chainId = await web3.Net.Version.SendRequestAsync();
        
        Debug.Log(chainId);
        updateConsole(chainId.ToString());
        }
        catch (Exception e)
        {
            Debug.Log(e);
            updateConsole(e.ToString());
        }
    }

    public void getBalance()
    {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        try
        {
            var balance = web3.Eth.GetBalance.SendRequestAsync(account.Address).Result.Value;
        
        Debug.Log(balance);
        updateConsole(balance.ToString());
        }
        catch (Exception e)
        {
            Debug.Log(e);
            updateConsole(e.ToString());
        }
    }

    public void signMessage()
    {
        if (account == null) {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        
        try
        {
            var msg = "wee test message 18/09/2017 02:55PM";
            var signer = new EthereumMessageSigner();
            var signature = signer.EncodeUTF8AndSign(msg, new EthECKey(privateKey));
        
            Debug.Log(signature);
            updateConsole(signature.ToString());
        } catch(Exception e)
        {
            Debug.Log(e);
            updateConsole(e.ToString());
        }
    }

    public async void sendTransaction()
    {
        if (account == null)
        {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        try
        {
            var toAddress = "0x2E464670992574A613f10F7682D5057fB507Cc21";
            var transaction = await web3.TransactionManager.SendTransactionAsync(account.Address, toAddress, new Nethereum.Hex.HexTypes.HexBigInteger(1));

            Debug.Log(transaction);
            updateConsole(transaction.ToString());

        } catch(Exception e)
        {
            Debug.Log(e);
            updateConsole(e.ToString());
        }
        
    }

    public void enableMFA()
    {
        var selectedProvider = Provider.JWT;

        var options = new LoginParams()
        {
            loginProvider = selectedProvider,
            extraLoginOptions = new ExtraLoginOptions()
            {
                domain = "https://web3auth.au.auth0.com",
                verifierIdField = "sub",
                prompt = Prompt.LOGIN,
            }
        };

        web3Auth.enableMFA(options);
    }

    private void onMFASetup(bool response)
    {
        Debug.Log("MFA Setup: " + response);
    }

    public void launchWalletServices()
    {
        var chainConfig = new ChainConfig()
        {
            chainId = "0x1",
            rpcTarget = rpcURL,
            ticker = "ETH",
            chainNamespace = Web3Auth.ChainNamespace.EIP155
        };
        web3Auth.launchWalletServices(chainConfig);
    }



    public void updateConsole(string message){
        console.text = message;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}