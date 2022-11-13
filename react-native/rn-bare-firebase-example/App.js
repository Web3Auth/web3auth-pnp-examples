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
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const scheme = 'web3authrnbarefirebase'; // Or your desired app redirection scheme
const resolvedRedirectUrl = `${scheme}://openlogin`;
const clientId =
  'BHr_dKcxC0ecKn_2dZQmQeNdjPgWykMkcodEHkVvPMo71qzOV6SgtoN8KCvFdLN7bf34JOm89vWQMLFmSfIo84A';
const providerUrl = 'https://rpc.ankr.com/eth'; // Or your desired provider url

async function signInWithGoogle() {
  try {
    GoogleSignin.configure({
      webClientId:
        '461819774167-5iv443bdf5a6pnr2drt4tubaph270obl.apps.googleusercontent.com',
    });
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const res = await auth().signInWithCredential(googleCredential);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export default function App() {
  const [key, setKey] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [console, setConsole] = useState('');

  const login = async () => {
    try {
      setConsole('Logging in');
      const web3auth = new Web3Auth(WebBrowser, {
        clientId,
        network: OPENLOGIN_NETWORK.TESTNET, // or other networks
        loginConfig: {
          jwt: {
            name: 'Web3Auth-Auth0-JWT',
            verifier: 'web3auth-core-firebase',
            typeOfLogin: 'jwt',
            clientId,
          },
        },
      });

      const loginRes = await signInWithGoogle();
      uiConsole('Google login success', loginRes);
      const idToken = await loginRes.user.getIdToken(true);
      uiConsole('idToken', idToken);

      const info = await web3auth.login({
        loginProvider: LOGIN_PROVIDER.JWT,
        redirectUrl: resolvedRedirectUrl,
        mfaLevel: 'none',
        curve: 'secp256k1',
        extraLoginOptions: {
          id_token: idToken,
          verifierIdField: 'sub',
          domain: 'http://localhost:3000',
        },
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
      <Button title="Login with Web3Auth" onPress={login} />
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
