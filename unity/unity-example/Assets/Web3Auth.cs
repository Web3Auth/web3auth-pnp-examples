using System;
using System.Linq;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Newtonsoft.Json;

public class Web3custom : MonoBehaviour
{
    Web3Auth web3Auth;

    // Start is called before the first frame update
    void Start()
    {
        web3Auth = GetComponent<Web3Auth>();
        web3Auth.setOptions(new Web3AuthOptions()
        {
            
        });
        web3Auth.onLogin += onLogin;
        web3Auth.onLogout += onLogout;
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
    }

    public void logout()
    {
        web3Auth.logout();
        Debug.Log("Logged out!");
    }

    private void onLogout()
    {
    
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
