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

    LoginParams loginParams;

    Provider selectedProvider = Provider.GOOGLE;

    // Start is called before the first frame update
    void Start()
    {
        var googleLoginConfig = new LoginConfigItem()
        {
            verifier = "agg-google-emailpswd-github",
            verifierSubIdentifier = "w3a-google",
            typeOfLogin = TypeOfLogin.GOOGLE,
            clientId =
              "774338308167-q463s7kpvja16l4l0kko3nb925ikds2p.apps.googleusercontent.com",
        };

        var githubLoginConfig = new LoginConfigItem()
        {
            verifier = "agg-google-emailpswd-github",
            verifierSubIdentifier = "w3a-github",
            typeOfLogin = TypeOfLogin.JWT,
            clientId = "TcuxIlWeaexIhVzsyc4sShzHJxwJ7nsO",
        };

        var emailPasswordlessLoginConfig = new LoginConfigItem()
        {
            verifier = "agg-google-emailpswd-github",
            verifierSubIdentifier = "w3a-email-passwordless",
            typeOfLogin = TypeOfLogin.JWT,
            clientId = "QQRQNGxJ80AZ5odiIjt1qqfryPOeDcb1",
        };

        web3Auth = GetComponent<Web3Auth>();

        web3Auth.setOptions(new Web3AuthOptions()
        {
            clientId = "BHZPoRIHdrfrdXj5E8G5Y72LGnh7L8UFuM8O0KrZSOs4T8lgiZnebB5Oc6cbgYSo3qSz7WBZXIs8fs6jgZqFFgw",
            redirectUrl = new System.Uri("torusapp://com.torus.Web3AuthUnity/auth"),
            network = Web3Auth.Network.TESTNET,
            loginConfig = new Dictionary<string, LoginConfigItem>
            {
                {"google", googleLoginConfig},
                {"github", githubLoginConfig},
                {"jwt", emailPasswordlessLoginConfig},
            }

        });
        web3Auth.onLogin += onLogin;
        web3Auth.onLogout += onLogout;
        web3 = new Web3(rpcURL);
        updateConsole("Ready to Login!");
    }

    public void onVerifierDropdownValueChange(int index)
    {
        switch (index)
        {
            case 0:
                selectedProvider = Provider.GOOGLE;
                break;
            case 1:
                selectedProvider = Provider.GITHUB;
                break;
            case 2:
                selectedProvider = Provider.JWT;
                break;
        }
    }

    public void login()
    {
        if (selectedProvider == Provider.GITHUB || selectedProvider == Provider.JWT)
        {
            loginParams = new LoginParams()
            {
                loginProvider = selectedProvider,
                extraLoginOptions = new ExtraLoginOptions()
                {
                    domain = "https://shahbaz-torus.us.auth0.com",
                    // this corresponds to the field inside jwt which must be used to uniquely
                    // identify the user. This is mapped b/w google and github logins
                    verifierIdField = "email",
                    isVerifierIdCaseSensitive = false,
                    prompt = Prompt.LOGIN,
                }
            };
        }
        else
        {
            loginParams = new LoginParams()
            {
                loginProvider = selectedProvider,
            };
        }

        web3Auth.login(loginParams);
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

    public void getPrivateKey()
    {
        if (account == null)
        {
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

    public async void getChainId()
    {
        if (account == null)
        {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        var chainId = await web3.Net.Version.SendRequestAsync();

        Debug.Log(chainId);
        updateConsole(chainId.ToString());
    }

    public async void sendTransaction()
    {
        if (account == null)
        {
            Debug.Log("Please Login First");
            updateConsole("Please Login First");
            return;
        }
        var toAddress = "0x2E464670992574A613f10F7682D5057fB507Cc21";
        var transaction = await web3.TransactionManager.SendTransactionAsync(account.Address, toAddress, new Nethereum.Hex.HexTypes.HexBigInteger(1));

        Debug.Log(transaction);
        updateConsole(transaction.ToString());
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

    public void updateConsole(string message)
    {
        console.text = message;
    }

    // Update is called once per frame
    void Update()
    {

    }
}