import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
} from '@web3auth/react-native-sdk';
import RPC from './ethersRPC'; // for using ethers.js

const scheme = 'web3authrnbareaggregateexample'; // Or your desired app redirection scheme
const resolvedRedirectUrl = `${scheme}://openlogin`;
const clientId =
  'BHZPoRIHdrfrdXj5E8G5Y72LGnh7L8UFuM8O0KrZSOs4T8lgiZnebB5Oc6cbgYSo3qSz7WBZXIs8fs6jgZqFFgw';

export default function App() {
  const [key, setKey] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [console, setConsole] = useState('');

  const login = async (loginProvider) => {
    try {
      setConsole('Logging in');
      const web3auth = new Web3Auth(WebBrowser, {
        clientId,
        network: OPENLOGIN_NETWORK.TESTNET, // or other networks
        loginConfig: {
          google: {
            verifier: "agg-google-emailpswd-github",
            verifierSubIdentifier: "w3a-google",
            typeOfLogin: "google",
            clientId:
              "774338308167-q463s7kpvja16l4l0kko3nb925ikds2p.apps.googleusercontent.com",
          },
          auth0emailpasswordless: {
            verifier: "agg-google-emailpswd-github",
            verifierSubIdentifier: "w3a-email-passwordless",
            typeOfLogin: "jwt",
            clientId: "QQRQNGxJ80AZ5odiIjt1qqfryPOeDcb1",
            jwtParameters: {
              domain: "https://shahbaz-torus.us.auth0.com",
              // this corresponds to the field inside jwt which must be used to uniquely
              // identify the user. This is mapped b/w google and email passwordless logins of Auth0
              verifierIdField: "email",
              isVerifierIdCaseSensitive: false,
            },
          },
          auth0github: {
            verifier: "agg-google-emailpswd-github",
            verifierSubIdentifier: "w3a-github",
            typeOfLogin: "jwt",
            clientId: "TcuxIlWeaexIhVzsyc4sShzHJxwJ7nsO",
            jwtParameters: {
              domain: "https://shahbaz-torus.us.auth0.com",
              // this corresponds to the field inside jwt which must be used to uniquely
              // identify the user. This is mapped b/w google and github logins
              verifierIdField: "email",
              isVerifierIdCaseSensitive: false,
            },
          },
        },
      });
      const info = await web3auth.login({
        loginProvider,
        redirectUrl: resolvedRedirectUrl,
        mfaLevel: 'none',
        curve: 'secp256k1',
      });
      
      setUserInfo(info);
      setKey(info.privKey);
      uiConsole('Logged In');
    } catch (e) {
      console.error(e);
    }
  };

  const getChainId = async () => {
    setConsole('Getting chain id');
    const networkDetails = await RPC.getChainId();
    uiConsole(networkDetails);
  };

  const getAccounts = async () => {
    setConsole('Getting account');
    const address = await RPC.getAccounts(key);
    uiConsole(address);
  };
  const getBalance = async () => {
    setConsole('Fetching balance');
    const balance = await RPC.getBalance(key);
    uiConsole(balance);
  };
  const sendTransaction = async () => {
    setConsole('Sending transaction');
    const tx = await RPC.sendTransaction(key);
    uiConsole(tx);
  };
  const signMessage = async () => {
    setConsole('Signing message');
    const message = await RPC.signMessage(key);
    uiConsole(message);
  };

  const uiConsole = (...args) => {
    setConsole(JSON.stringify(args || {}, null, 2) + '\n\n\n\n' + console);
  };

  const loggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Get User Info" onPress={() => uiConsole(userInfo)} />
      <Button title="Get Chain ID" onPress={() => getChainId()} />
      <Button title="Get Accounts" onPress={() => getAccounts()} />
      <Button title="Get Balance" onPress={() => getBalance()} />
      <Button title="Send Transaction" onPress={() => sendTransaction()} />
      <Button title="Sign Message" onPress={() => signMessage()} />
      <Button title="Get Private Key" onPress={() => uiConsole(key)} />
      <Button title="Log Out" onPress={() => setKey('')} />
    </View>
  );

  const unloggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Login with Google" onPress={() => login("google")} />
      <Button title="Login with Auth0 Email Passwordless" onPress={() => login("auth0emailpasswordless")} />
      <Button title="Login with GitHub" onPress={() => login("auth0github")} />
    </View>
  );

  return (
    <View style={styles.container}>
      {key ? loggedInView : unloggedInView}
      <View style={styles.consoleArea}>
        <Text style={styles.consoleText}>Console:</Text>
        <ScrollView style={styles.console}>
          <Text>{console}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  consoleArea: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  console: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    color: '#ffffff',
    padding: 10,
    width: Dimensions.get('window').width - 60,
  },
  consoleText: {
    padding: 10,
  },
  buttonArea: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 30,
  },
});
