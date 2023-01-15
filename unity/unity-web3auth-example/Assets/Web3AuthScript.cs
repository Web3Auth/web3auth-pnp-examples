using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Newtonsoft.Json;
using TMPro;

public class Web3AuthScript : MonoBehaviour
{
    Web3Auth web3Auth;
    public TextMeshProUGUI console;

    // Start is called before the first frame update
    void Start()
    {
        web3Auth = GetComponent<Web3Auth>();
        web3Auth.setOptions(new Web3AuthOptions()
        {
            clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"
        });
        web3Auth.onLogin += onLogin;
        web3Auth.onLogout += onLogout;
        updateConsole("Ready to Login!");
    }

    public void login()
    {
        var selectedProvider = Provider.GOOGLE;

        var options = new LoginParams()
        {
            loginProvider = selectedProvider
        };

        web3Auth.login(options);
    }

    private void onLogin(Web3AuthResponse response)
    {
        var userInfo = JsonConvert.SerializeObject(response.userInfo, Formatting.Indented);
        Debug.Log(userInfo);
        updateConsole(userInfo);
    }

    public void logout()
    {
        web3Auth.logout();
        Debug.Log("Logged out!");
        updateConsole("Logged out!");
    }

    private void onLogout()
    {
    
    }

    public void updateConsole(string message){
        console.text = message;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}