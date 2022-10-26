import 'dart:collection';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/output.dart';
import 'dart:async';

import 'package:web3auth_flutter/web3auth_flutter.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String _result = '';
  bool logoutVisible = false;

  @override
  void dispose() {
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    final themeMap = HashMap<String, String>();
    themeMap['primary'] = "#229954";

    Uri redirectUrl;
    if (Platform.isAndroid) {
      redirectUrl = Uri.parse('w3a://com.example.w3aflutter/auth');
    } else if (Platform.isIOS) {
      redirectUrl = Uri.parse('com.example.w3aflutter://openlogin');
    } else {
      throw UnKnownException('Unknown platform');
    }

    final loginConfig = HashMap<String, LoginConfigItem>();
    loginConfig['google'] = LoginConfigItem(
        verifier: "web3auth-core-google", // get it from web3auth dashboard
        typeOfLogin: TypeOfLogin.google,
        name: "Google Custom Authentication",
        clientId:
            "774338308167-q463s7kpvja16l4l0kko3nb925ikds2p.apps.googleusercontent.com" // web3auth's plug and play client id
        );

    await Web3AuthFlutter.init(Web3AuthOptions(
        clientId:
            'BHZPoRIHdrfrdXj5E8G5Y72LGnh7L8UFuM8O0KrZSOs4T8lgiZnebB5Oc6cbgYSo3qSz7WBZXIs8fs6jgZqFFgw',
        network: Network.testnet,
        redirectUrl: redirectUrl,
        whiteLabel: WhiteLabelData(
            dark: true, name: "Web3Auth Flutter App", theme: themeMap),
        loginConfig: loginConfig));
  }

  @override
  Widget build(BuildContext context) {
    // Map<String, dynamic> user = jsonDecode(_result);

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Web3Auth x Flutter Example'),
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
                          color: Color(0xFF0364ff)),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    const Text(
                      'Welcome to Web3Auth x Flutter Demo',
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
                    ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            backgroundColor: const Color.fromARGB(
                                255, 72, 133, 237) // This is what you need!
                            ),
                        onPressed: _login(_withGoogle),
                        child: const Text('Google')),
                  ],
                ),
              ),
              Visibility(
                // ignore: sort_child_properties_last
                child: Column(
                  children: [
                    Center(
                      child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                              backgroundColor:
                                  Colors.red[600] // This is what you need!
                              ),
                          onPressed: _logout(),
                          child: Column(
                            children: const [
                              Text('Logout'),
                            ],
                          )),
                    ),
                  ],
                ),
                visible: logoutVisible,
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
        setState(() {
          _result = response.toString();
          logoutVisible = true;
        });
      } on UserCancelledException {
        print("User cancelled.");
      } on UnKnownException {
        print("Unknown exception occurred");
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
        await Web3AuthFlutter.logout();
      } on UserCancelledException {
        print("User cancelled.");
      } on UnKnownException {
        print("Unknown exception occurred");
      }
    };
  }

  Future<Web3AuthResponse> _withGoogle() {
    return Web3AuthFlutter.login(LoginParams(
      loginProvider: Provider.google,
      mfaLevel: MFALevel.DEFAULT,
    ));
  }
}
