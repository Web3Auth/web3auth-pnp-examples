import 'package:flutter/material.dart';
import 'package:flutter_solana_example/core/widgets/custom_dialog.dart';
import 'package:flutter_solana_example/home_screen.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Web3Auth Flutter Solana Sample",
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            OutlinedButton(
              onPressed: () => _login(context),
              child: const Text("Login with Google"),
            )
          ],
        ),
      ),
    );
  }

  Future<void> _login(BuildContext context) async {
    try {
      await Web3AuthFlutter.login(
        LoginParams(
          loginProvider: Provider.google,
          mfaLevel: MFALevel.MANDATORY,
        ),
      );

      if (context.mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) {
            return const HomeScreen();
          }),
        );
      }
    } catch (e, _) {
      if (context.mounted) {
        showInfoDialog(context, e.toString());
      }
    }
  }
}
