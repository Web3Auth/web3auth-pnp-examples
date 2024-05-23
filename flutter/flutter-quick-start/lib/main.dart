import 'dart:async';
import 'dart:developer';
import 'dart:io';

import 'package:flutter/material.dart';
// IMP START - Quick Start
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/output.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';
// IMP END - Quick Start

import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

// IMP START - Quick Start
class _MyAppState extends State<MyApp> {
// IMP END - Quick Start
  String _result = '';
  bool logoutVisible = false;
  String rpcUrl = 'https://rpc.ankr.com/eth_sepolia';
  // TextEditingController for handling input from the text field
  final TextEditingController emailController = TextEditingController();

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    Uri redirectUrl;
    // IMP START - Get your Web3Auth Client ID from Dashboard
    String clientId =
        'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ';
    if (Platform.isAndroid) {
      redirectUrl = Uri.parse('w3a://com.example.w3aflutter/auth');
    } else if (Platform.isIOS) {
      redirectUrl = Uri.parse('com.example.w3aflutter://auth');
      // IMP END - Get your Web3Auth Client ID from Dashboard
    } else {
      throw UnKnownException('Unknown platform');
    }

    // IMP START - Initialize Web3Auth
    await Web3AuthFlutter.init(Web3AuthOptions(
      clientId: clientId,
      network: Network.sapphire_mainnet,
      redirectUrl: redirectUrl,
      buildEnv: BuildEnv.production,
      // 259200 allows user to stay authenticated for 3 days with Web3Auth.
      // Default is 86400, which is 1 day.
      sessionTime: 259200,
    ));

    await Web3AuthFlutter.initialize();
    // IMP END - Initialize Web3Auth

    final String res = await Web3AuthFlutter.getPrivKey();
    log(res);
    if (res.isNotEmpty) {
      setState(() {
        logoutVisible = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Web3Auth x Flutter QuickStart'),
        ),
        body: SingleChildScrollView(
          child: Center(
              child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Padding(
                padding: EdgeInsets.all(8.0),
              ),
              Visibility(
                visible: !logoutVisible,
                child: Column(
                  children: [
                    const Icon(
                      Icons.flutter_dash,
                      size: 80,
                      color: Color(0xFF1389fd),
                    ),
                    const SizedBox(
                      height: 40,
                    ),
                    const Text(
                      'Web3Auth',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 36,
                        color: Color(0xFF0364ff),
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    const Text(
                      'Welcome to Web3Auth x Flutter Quick Start Demo',
                      style: TextStyle(fontSize: 14),
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    const Text(
                      'Login with',
                      style: TextStyle(fontSize: 12),
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    // Text field for entering the user's email
                    TextField(
                      controller: emailController,
                      decoration: const InputDecoration(
                        labelText: 'Enter Email',
                      ),
                    ),
                    ElevatedButton(
                      onPressed: _login(
                        () => _withEmailPasswordless(emailController.text),
                      ),
                      child: const Text('Login with Email Passwordless'),
                    ),
                  ],
                ),
              ),
              ElevatedButtonTheme(
                data: ElevatedButtonThemeData(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 195, 47, 233),
                    foregroundColor: Colors.white,
                  ),
                ),
                child: Visibility(
                  visible: logoutVisible,
                  child: Column(
                    children: [
                      Center(
                        child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red[600],
                              foregroundColor: Colors.white,
                            ),
                            onPressed: _logout(),
                            child: const Column(
                              children: [
                                Text('Logout'),
                              ],
                            )),
                      ),
                      const Text(
                        'Blockchain calls',
                        style: TextStyle(fontSize: 20),
                      ),
                      ElevatedButton(
                        onPressed: _getUserInfo,
                        child: const Text('Get UserInfo'),
                      ),
                      ElevatedButton(
                        onPressed: _getAddress,
                        child: const Text('Get Address'),
                      ),
                      ElevatedButton(
                        onPressed: _getBalance,
                        child: const Text('Get Balance'),
                      ),
                      ElevatedButton(
                        onPressed: _sendTransaction,
                        child: const Text('Send Transaction'),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(_result),
              )
            ],
          )),
        ),
      ),
    );
  }

  VoidCallback _login(Future<Web3AuthResponse> Function() method) {
    return () async {
      try {
        final Web3AuthResponse response = await method();
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('privateKey', response.privKey.toString());
        setState(() {
          _result = response.toString();
          logoutVisible = true;
        });
      } on UserCancelledException {
        log("User cancelled.");
      } on UnKnownException {
        log("Unknown exception occurred");
      }
    };
  }

  VoidCallback _logout() {
    return () async {
      try {
        setState(() {
          _result = '';
          logoutVisible = false;
        });
        // IMP START - Logout
        await Web3AuthFlutter.logout();
        // IMP END - Logout
      } on UserCancelledException {
        log("User cancelled.");
      } on UnKnownException {
        log("Unknown exception occurred");
      }
    };
  }

  Future<Web3AuthResponse> _withEmailPasswordless(String userEmail) async {
    try {
      log(userEmail);
      // IMP START - Login
      return await Web3AuthFlutter.login(LoginParams(
        loginProvider: Provider.email_passwordless,
        extraLoginOptions: ExtraLoginOptions(login_hint: userEmail),
      ));
      // IMP END - Login
    } catch (e) {
      log("Error during email/passwordless login: $e");
      // Handle the error as needed
      // You might want to show a user-friendly message or log the error
      return Future.error("Login failed");
    }
  }

  Future<TorusUserInfo> _getUserInfo() async {
    try {
      // IMP START - Get User Info
      TorusUserInfo userInfo = await Web3AuthFlutter.getUserInfo();
      // IMP END - Get User Info
      log(userInfo.toString());
      setState(() {
        _result = userInfo.toString();
      });
      return userInfo;
    } catch (e) {
      log("Error during email/passwordless login: $e");
      // Handle the error as needed
      // You might want to show a user-friendly message or log the error
      return Future.error("Login failed");
    }
  }

  // IMP START - Blockchain Calls
  Future<String> _getAddress() async {
    final prefs = await SharedPreferences.getInstance();
    final privateKey = prefs.getString('privateKey') ?? '0';

    final credentials = EthPrivateKey.fromHex(privateKey);
    final address = credentials.address;
    log("Account, ${address.hexEip55}");
    setState(() {
      _result = address.hexEip55.toString();
    });
    return address.hexEip55;
  }

  Future<EtherAmount> _getBalance() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final privateKey = prefs.getString('privateKey') ?? '0';

      final client = Web3Client(rpcUrl, Client());
      final credentials = EthPrivateKey.fromHex(privateKey);
      final address = credentials.address;

      // Get the balance in wei
      final weiBalance = await client.getBalance(address);

      // Convert wei to ether
      final etherBalance = EtherAmount.fromBigInt(
        EtherUnit.ether,
        weiBalance.getInEther,
      );

      log(etherBalance.toString());

      setState(() {
        _result = etherBalance.toString();
      });

      return etherBalance;
    } catch (e) {
      // Handle errors as needed
      log("Error getting balance: $e");
      return EtherAmount.zero();
    }
  }

  Future<String> _sendTransaction() async {
    final prefs = await SharedPreferences.getInstance();
    final privateKey = prefs.getString('privateKey') ?? '0';

    final client = Web3Client(rpcUrl, Client());
    final credentials = EthPrivateKey.fromHex(privateKey);
    final address = credentials.address;
    try {
      final receipt = await client.sendTransaction(
        credentials,
        Transaction(
          from: address,
          to: EthereumAddress.fromHex(
            '0xeaA8Af602b2eDE45922818AE5f9f7FdE50cFa1A8',
          ),
          // gasPrice: EtherAmount.fromUnitAndValue(EtherUnit.gwei, 100),
          value: EtherAmount.fromInt(
            EtherUnit.gwei,
            5000000,
          ), // 0.005 ETH
        ),
        chainId: 11155111,
      );
      log(receipt);
      setState(() {
        _result = receipt;
      });
      return receipt;
    } catch (e) {
      setState(() {
        _result = e.toString();
      });
      return e.toString();
    }
  }
  // IMP END - Blockchain Calls
}
