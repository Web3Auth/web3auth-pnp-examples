import React, { useState } from "react";
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from "react-native";
import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK } from "@web3auth/react-native-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Buffer } from "buffer";
import "@ethersproject/shims";
import { ethers } from "ethers";
global.Buffer = global.Buffer || Buffer;
    
const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo || Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: scheme });

const clientId = "BP-HcHP_eD6X-TEZhh_yTC2p9skVcoe2iwqcvDH2jV2kHxEr7U8_ZsMARgiwl_5jX9FYRNuKjtzBHfam_GUe6qg";
const providerUrl = "https://rpc.ankr.com/eth"; // Or your desired provider url
      
export default function App() {
  const [key, setKey] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [console, setConsole] = useState("");

  const login = async () => {
    try {
      setConsole("Logging in");
      const web3auth = new Web3Auth(WebBrowser, {
        clientId,
        network: OPENLOGIN_NETWORK.TESTNET, // or other networks
      });
      const info = await web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE,
        redirectUrl: resolvedRedirectUrl,
        mfaLevel: "none",
        curve: "secp256k1",
      });

      setUserInfo(info);
      setKey(info.privKey);
      uiConsole("Logged In");
    } catch (e) {
      uiConsole(e);
    }
  };

  const getChainId = async () => {
    try {
      setConsole("Getting chain id");
      const ethersProvider = ethers.getDefaultProvider(providerUrl);
      const networkDetails = await ethersProvider.getNetwork();
      uiConsole(networkDetails);
    } catch (e) {
      uiConsole(e);
    }
  }
  
  const getAccounts = async () => {
    try {
      setConsole("Getting account");
      const wallet = new ethers.Wallet(key)
      const address = await wallet.address;
      uiConsole(address);
    } catch (e) {
      uiConsole(e);
    }
  };
  const getBalance = async () => {
    try {
      setConsole("Fetching balance");
      const ethersProvider = ethers.getDefaultProvider(providerUrl);
      const wallet = new ethers.Wallet(key, ethersProvider);
      const balance = await wallet.getBalance();
      uiConsole(balance);
    } catch (e) {
      uiConsole(e);
    }
  };
  const sendTransaction = async () => {
    try {
      setConsole("Sending transaction");
      const ethersProvider = ethers.getDefaultProvider(providerUrl);
      const wallet = new ethers.Wallet(key, ethersProvider);

      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

      // Convert 1 ether to wei
      const amount = ethers.utils.parseEther("0.001");

      // Submit transaction to the blockchain
      const tx = await wallet.sendTransaction({
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });
      uiConsole(tx);
    } catch (e) {
      uiConsole(e);
    }
  };
  const signMessage = async () => {
    try {
      setConsole("Signing message");
      const ethersProvider = ethers.getDefaultProvider(providerUrl);
      const wallet = new ethers.Wallet(key, ethersProvider);

      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const signedMessage = await wallet.signMessage(originalMessage);

      uiConsole(signedMessage);
    } catch (e) {
      uiConsole(e);
    }
  };

  const uiConsole = (...args) => {
    setConsole(JSON.stringify(args || {}, null, 2)+ "\n\n\n\n" + console);
  };

  const loggedInView = (
    <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
      <Button title="Get User Info" onPress={() => uiConsole(userInfo)} style={styles.button} />
      <Button title="Get Chain ID" onPress={() => getChainId()} style={styles.button} />
      <Button title="Get Accounts" onPress={() => getAccounts()} style={styles.button} />
      <Button title="Get Balance" onPress={() => getBalance()} style={styles.button} />
      <Button title="Send Transaction" onPress={() => sendTransaction()} style={styles.button} />
      <Button title="Sign Message" onPress={() => signMessage()} style={styles.button} />
      <Button title="Get Private Key" onPress={() => uiConsole(key)} style={styles.button} />
      <Button title="Log Out" onPress={() => setKey("")} style={styles.button} />
    </View>
  );
  
  const unloggedInView = (
    <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
      <Button title="Login with Web3Auth" onPress={login} style={styles.button} />
    </View>
  );

  return (
    <View style={styles.container}>
      {key ? loggedInView : unloggedInView}
      <View style={styles.consoleArea}>
        <Text style={{ padding: 10 }}>Console:</Text>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    margin: 5,
    padding: 5
  },
  consoleArea: {
    margin: 20, 
    alignItems: "center", 
    justifyContent: "center", 
    flex: 1,
  },
  console: {
    flex: 1,
    backgroundColor: "#CCCCCC",
    color: "#ffffff",
    padding: 10,
    width: Dimensions.get('window').width - 60,
  }
});