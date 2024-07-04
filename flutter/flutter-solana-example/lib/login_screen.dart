import 'package:flutter/material.dart';
import 'package:flutter_solana_example/core/extensions.dart';
import 'package:flutter_solana_example/core/widgets/custom_dialog.dart';
import 'package:flutter_solana_example/home_screen.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with WidgetsBindingObserver {
  late final TextEditingController textEditingController;
  late final GlobalKey<FormState> formKey;

  Widget get verticalGap => const SizedBox(height: 16);

  @override
  void initState() {
    super.initState();
    textEditingController = TextEditingController();
    formKey = GlobalKey<FormState>();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    super.dispose();
    WidgetsBinding.instance.removeObserver(this);
  }

  @override
  void didChangeAppLifecycleState(final AppLifecycleState state) {
    // This is important to trigger the on Android.
    if (state == AppLifecycleState.resumed) {
      Web3AuthFlutter.setCustomTabsClosed();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Web3Auth Flutter Solana Sample",
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
              maxLines: 2,
            ),
            verticalGap,
            Form(
              key: formKey,
              child: TextFormField(
                controller: textEditingController,
                validator: (email) {
                  final isValidEmail = email != null && email.isValidEmail;
                  if (isValidEmail) {
                    return null;
                  }
                  return "Please enter a valid email";
                },
                decoration: const InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(8)),
                  ),
                ),
              ),
            ),
            verticalGap,
            OutlinedButton(
              onPressed: () => _login(context, Provider.email_passwordless),
              child: const Text("Login with Email passwordless"),
            ),
            verticalGap,
            OutlinedButton(
              onPressed: () => _login(context, Provider.google),
              child: const Text("Login with Google"),
            )
          ],
        ),
      ),
    );
  }

  Future<void> _login(
    BuildContext context,
    Provider loginProvider,
  ) async {
    try {
      final bool isEmailPasswordLessLogin =
          loginProvider == Provider.email_passwordless;

      if (isEmailPasswordLessLogin) {
        if (!formKey.currentState!.validate()) {
          return;
        }
      }

      final userEmail = textEditingController.text;

      await Web3AuthFlutter.login(
        LoginParams(
          loginProvider: loginProvider,
          mfaLevel: MFALevel.DEFAULT,
          extraLoginOptions: isEmailPasswordLessLogin
              ? ExtraLoginOptions(login_hint: userEmail)
              : null,
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
