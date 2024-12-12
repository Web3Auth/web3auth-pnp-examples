import 'dart:developer';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_solana_example/core/service_locator.dart';
import 'package:flutter_solana_example/home_screen.dart';
import 'package:flutter_solana_example/login_screen.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  ServiceLocator.init();
  final Uri redirectUrl;
  if (Platform.isAndroid) {
    redirectUrl =
        Uri.parse('w3aexample://com.example.flutter_solana_example');
  } else {
    redirectUrl = Uri.parse('com.web3auth.fluttersolanasample://auth');
  }

  await Web3AuthFlutter.init(
    Web3AuthOptions(
      clientId:
          "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
      network: Network.sapphire_mainnet,
      redirectUrl: redirectUrl,
      whiteLabel: WhiteLabelData(
        appName: "Solana Web3Auth Flutter",
        mode: ThemeModes.dark,
      ),
      sessionTime: 40,
    ),
  );

  try {
    await Web3AuthFlutter.initialize();
  } catch (e) {
    log(e.toString());
  }

  runApp(const MainApp());
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  late final Future<String> privateKeyFuture;
  @override
  void initState() {
    super.initState();
    privateKeyFuture = Web3AuthFlutter.getEd25519PrivKey();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FutureBuilder<String>(
        future: privateKeyFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasData) {
              if (snapshot.data!.isNotEmpty) {
                return const HomeScreen();
              }
            }
            return const LoginScreen();
          }
          return const Center(
            child: CircularProgressIndicator.adaptive(),
          );
        },
      ),
    );
  }
}
