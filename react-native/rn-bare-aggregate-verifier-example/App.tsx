import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, ScrollView, Dimensions } from "react-native";
import * as WebBrowser from "@toruslabs/react-native-web-browser";
import EncryptedStorage from "react-native-encrypted-storage";
import Web3Auth, { OPENLOGIN_NETWORK, ChainNamespace } from "@web3auth/react-native-sdk";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// import RPC from './web3RPC'; // for using web3.js
// import RPC from "./viemRPC"; // for using viem
import RPC from "./ethersRPC"; // for using ethers.js

const scheme = "web3authrnbareaggregateexample"; // Or your desired app redirection scheme
const redirectUrl = `${scheme}://openlogin`;
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  decimals: 18,
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId,
  network: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET, // or other networks
  redirectUrl,
  useCoreKitKey: true,
  loginConfig: {
    google: {
      verifier: "aggregate-sapphire",
      verifierSubIdentifier: "w3a-google",
      typeOfLogin: "google",
      clientId: "519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com",
    },
    auth0emailpasswordless: {
      verifier: "aggregate-sapphire",
      verifierSubIdentifier: "w3a-a0-email-passwordless",
      typeOfLogin: "jwt",
      clientId: "QiEf8qZ9IoasbZsbHvjKZku4LdnRC1Ct",
      jwtParameters: {
        domain: "https://web3auth.au.auth0.com",
        // this corresponds to the field inside jwt which must be used to uniquely
        // identify the user. This is mapped b/w google and email passwordless logins of Auth0
        verifierIdField: "email",
        isVerifierIdCaseSensitive: false,
      },
    },
    auth0github: {
      verifier: "aggregate-sapphire",
      verifierSubIdentifier: "w3a-a0-github",
      typeOfLogin: "jwt",
      clientId: "hiLqaop0amgzCC0AXo4w0rrG9abuJTdu",
      jwtParameters: {
        domain: "https://web3auth.au.auth0.com",
        // this corresponds to the field inside jwt which must be used to uniquely
        // identify the user. This is mapped b/w google and github logins
        verifierIdField: "email",
        isVerifierIdCaseSensitive: false,
      },
    },
  },
});

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [console, setConsole] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      // IMP START - SDK Initialization
      await web3auth.init();

      if (web3auth.privKey) {
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        // IMP END - SDK Initialization
        setProvider(ethereumPrivateKeyProvider);
        setLoggedIn(true);
      }
    };
    init();
  }, []);

  const login = async (loginProvider: string) => {
    try {
      setConsole("Logging in");
      await web3auth.login({
        loginProvider,
        mfaLevel: "none",
      });

      uiConsole("Logged In");
      if (web3auth.privKey) {
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        // IMP END - Login
        setProvider(ethereumPrivateKeyProvider);
        uiConsole("Logged In");
        setLoggedIn(true);
      }
    } catch (error) {
      uiConsole("error:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      setConsole("Web3auth not initialized");
      return;
    }

    setConsole("Logging out");
    await web3auth.logout();

    if (!web3auth.privKey) {
      setProvider(null);
      uiConsole("Logged out");
      setLoggedIn(false);
    }
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Getting chain id");
    const networkDetails = await rpc.getChainId();
    uiConsole(networkDetails);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Getting account");
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Fetching balance");
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Sending transaction");
    const tx = await rpc.sendTransaction();
    uiConsole(tx);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Signing message");
    const message = await rpc.signMessage();
    uiConsole(message);
  };

  const launchWalletServices = async () => {
    if (!web3auth) {
      setConsole("Web3auth not initialized");
      return;
    }

    setConsole("Launch Wallet Services");
    await web3auth.launchWalletServices(chainConfig);
  };

  const requestSignature = async () => {
    if (!web3auth) {
      setConsole("Web3auth not initialized");
      return;
    }
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);

    const address = await rpc.getAccounts();

    // const params = [
    //   {
    //     challenge: 'Hello World',
    //     address,
    //   },
    //   null,
    // ];
    const params = ["Hello World", address];
    // const params = [{ }];
    // params.push('Hello World');
    // params.push(address);

    // const params = [
    //   address,
    //   {
    //     types: {
    //       EIP712Domain: [
    //         {
    //           name: 'name',
    //           type: 'string',
    //         },
    //         {
    //           name: 'version',
    //           type: 'string',
    //         },
    //         {
    //           name: 'chainId',
    //           type: 'uint256',
    //         },
    //         {
    //           name: 'verifyingContract',
    //           type: 'address',
    //         },
    //       ],
    //       Person: [
    //         {
    //           name: 'name',
    //           type: 'string',
    //         },
    //         {
    //           name: 'wallet',
    //           type: 'address',
    //         },
    //       ],
    //       Mail: [
    //         {
    //           name: 'from',
    //           type: 'Person',
    //         },
    //         {
    //           name: 'to',
    //           type: 'Person',
    //         },
    //         {
    //           name: 'contents',
    //           type: 'string',
    //         },
    //       ],
    //     },
    //     primaryType: 'Mail',
    //     domain: {
    //       name: 'Ether Mail',
    //       version: '1',
    //       chainId: chainConfig.chainId,
    //       verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    //     },
    //     message: {
    //       from: {
    //         name: 'Cow',
    //         wallet: address,
    //       },
    //       to: {
    //         name: 'Bob',
    //         wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    //       },
    //       contents: 'Hello, Bob!',
    //     },
    //   },
    // ];

    setConsole("Request Signature");
    const res = await web3auth.request(chainConfig, "personal_sign", params);
    uiConsole(res);
  };

  const uiConsole = (...args: unknown[]) => {
    setConsole(JSON.stringify(args || {}, null, 2) + "\n\n\n\n" + console);
  };

  const loggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Get User Info" onPress={() => uiConsole(web3auth.userInfo())} />
      <Button title="Get Chain ID" onPress={() => getChainId()} />
      <Button title="Get Accounts" onPress={() => getAccounts()} />
      <Button title="Get Balance" onPress={() => getBalance()} />
      <Button title="Send Transaction" onPress={() => sendTransaction()} />
      <Button title="Sign Message" onPress={() => signMessage()} />
      <Button title="Show Wallet UI" onPress={() => launchWalletServices()} />
      <Button title="Request Signature from Wallet Services" onPress={() => requestSignature()} />
      <Button title="Log Out" onPress={() => logout()} />
    </View>
  );

  const unloggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Login with Google" onPress={() => login("google")} />
      <Button title="Login with Auth0 Email Passwordless" onPress={() => login("auth0emailpasswordless")} />
      <Button title="Login with Auth0 GitHub" onPress={() => login("auth0github")} />
    </View>
  );

  return (
    <View style={styles.container}>
      {loggedIn ? loggedInView : unloggedInView}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 30,
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
    width: Dimensions.get("window").width - 60,
  },
  consoleText: {
    padding: 10,
  },
  buttonArea: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 30,
  },
});
