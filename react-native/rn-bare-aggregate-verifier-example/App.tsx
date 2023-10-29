import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import EncryptedStorage from 'react-native-encrypted-storage';
import Web3Auth, {
  OPENLOGIN_NETWORK,
  OpenloginUserInfo,
} from '@web3auth/react-native-sdk';
import RPC from './ethersRPC'; // for using ethers.js

const scheme = 'web3authrnbareaggregateexample'; // Or your desired app redirection scheme
const resolvedRedirectUrl = `${scheme}://openlogin`;
const clientId =
  'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ';
const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId,
  network: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET, // or other networks
  loginConfig: {
    google: {
      verifier: 'aggregate-sapphire',
      verifierSubIdentifier: 'w3a-google',
      typeOfLogin: 'google',
      clientId:
        '519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com',
    },
    auth0emailpasswordless: {
      verifier: 'aggregate-sapphire',
      verifierSubIdentifier: 'w3a-a0-email-passwordless',
      typeOfLogin: 'jwt',
      clientId: 'QiEf8qZ9IoasbZsbHvjKZku4LdnRC1Ct',
      jwtParameters: {
        domain: 'https://web3auth.au.auth0.com',
        // this corresponds to the field inside jwt which must be used to uniquely
        // identify the user. This is mapped b/w google and email passwordless logins of Auth0
        verifierIdField: 'email',
        isVerifierIdCaseSensitive: false,
      },
    },
    auth0github: {
      verifier: 'aggregate-sapphire',
      verifierSubIdentifier: 'w3a-a0-github',
      typeOfLogin: 'jwt',
      clientId: 'hiLqaop0amgzCC0AXo4w0rrG9abuJTdu',
      jwtParameters: {
        domain: 'https://web3auth.au.auth0.com',
        // this corresponds to the field inside jwt which must be used to uniquely
        // identify the user. This is mapped b/w google and github logins
        verifierIdField: 'email',
        isVerifierIdCaseSensitive: false,
      },
    },
  },
});

export default function App() {
  const [userInfo, setUserInfo] = useState<OpenloginUserInfo | undefined>();
  const [key, setKey] = useState<string | undefined>('');
  const [console, setConsole] = useState<string>('');

  const login = async (loginProvider: string) => {
    try {
      if (!web3auth) {
        setConsole('Web3auth not initialized');
        return;
      }

      setConsole('Logging in');
      await web3auth.login({
        loginProvider,
        redirectUrl: resolvedRedirectUrl,
        mfaLevel: 'default',
        curve: 'secp256k1',
      });
      setConsole(`Logged in ${web3auth.privKey}`);
      if (web3auth.privKey) {
        setUserInfo(web3auth.userInfo());
        setKey(web3auth.privKey);
        uiConsole('Logged In');
      }
    } catch (e: any) {
      setConsole(e.message);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      setConsole('Web3auth not initialized');
      return;
    }

    setConsole('Logging out');
    await web3auth.logout();

    if (!web3auth.privKey) {
      setUserInfo(undefined);
      setKey('');
      uiConsole('Logged out');
    }
  };

  useEffect(() => {
    const init = async () => {
      await web3auth.init();
      if (web3auth?.privKey) {
        uiConsole('Re logged in');
        setUserInfo(web3auth.userInfo());
        setKey(web3auth.privKey);
        uiConsole(web3auth.privKey);
      }
    };
    init();
  }, []);

  const getChainId = async () => {
    setConsole('Getting chain id');
    const networkDetails = await RPC.getChainId();
    uiConsole(networkDetails);
  };

  const getAccounts = async () => {
    if (!key) {
      setConsole('User not logged in');
      return;
    }
    setConsole('Getting account');
    const address = await RPC.getAccounts(key);
    uiConsole(address);
  };
  const getBalance = async () => {
    if (!key) {
      setConsole('User not logged in');
      return;
    }
    setConsole('Fetching balance');
    const balance = await RPC.getBalance(key);
    uiConsole(balance);
  };
  const sendTransaction = async () => {
    if (!key) {
      setConsole('User not logged in');
      return;
    }
    setConsole('Sending transaction');
    const tx = await RPC.sendTransaction(key);
    uiConsole(tx);
  };
  const signMessage = async () => {
    if (!key) {
      setConsole('User not logged in');
      return;
    }
    setConsole('Signing message');
    const message = await RPC.signMessage(key);
    uiConsole(message);
  };

  const uiConsole = (...args: unknown[]) => {
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
      <Button title="Log Out" onPress={logout} />
    </View>
  );

  const unloggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Login with Google" onPress={() => login('google')} />
      <Button
        title="Login with Auth0 Email Passwordless"
        onPress={() => login('auth0emailpasswordless')}
      />
      <Button title="Login with GitHub" onPress={() => login('auth0github')} />
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
