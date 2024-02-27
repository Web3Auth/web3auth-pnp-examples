import 'package:flutter/material.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/utils/web3auth_utils.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

import 'features/home/presentation/screens/home_screen.dart';
import 'features/login/presentation/screens/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Web3AuthFlutter.init(
    Web3AuthOptions(
      clientId: StringConstants.web3AuthClientId,
      network: Network.sapphire_mainnet,
      redirectUrl: resolveRedirectUrl(),
      whiteLabel: WhiteLabelData(
        appName: StringConstants.appName,
        mode: ThemeModes.dark,
      ),
    ),
  );

  await Web3AuthFlutter.initialize();

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
    privateKeyFuture = Web3AuthFlutter.getPrivKey();
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
