import 'package:flutter/material.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/widgets/custom_dialog.dart';
import 'package:flutter_playground/core/widgets/custom_filled_buttond.dart';
import 'package:flutter_playground/core/widgets/custom_text_field.dart';
import 'package:flutter_playground/features/home/presentation/screens/home_screen.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with WidgetsBindingObserver {
  late final TextEditingController emailController;
  late final GlobalKey<FormState> formKey;

  Widget get verticalGap => const SizedBox(height: 16);

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController();
    formKey = GlobalKey<FormState>();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    WidgetsBinding.instance.removeObserver(this);
  }

  @override
  void didChangeAppLifecycleState(final AppLifecycleState state) {
    // This is important to trigger the user cancellation on Android.
    if (state == AppLifecycleState.resumed) {
      Web3AuthFlutter.setResultUrl();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Form(
          key: formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                StringConstants.web3AuthLogoUrl,
                width: 52,
              ),
              verticalGap,
              Text(
                StringConstants.appName,
                style: Theme.of(context)
                    .textTheme
                    .headlineMedium
                    ?.copyWith(fontWeight: FontWeight.w600),
                textAlign: TextAlign.center,
                maxLines: 2,
              ),
              verticalGap,
              verticalGap,
              CustomTextField(
                hintText: 'abc@gmail.com',
                textEditingController: emailController,
                validator: (value) {
                  if (value != null && value.isValidEmail) {
                    return null;
                  }
                  return "Please enter valid email";
                },
              ),
              verticalGap,
              CustomFilledButton(
                onTap: () => _login(context),
                text: StringConstants.loginWithEmailPasswordlessText,
              )
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _login(BuildContext context) async {
    try {
      if (!formKey.currentState!.validate()) {
        return;
      }

      await Web3AuthFlutter.login(
        LoginParams(
          loginProvider: Provider.email_passwordless,
          mfaLevel: MFALevel.DEFAULT,
          extraLoginOptions: ExtraLoginOptions(
            login_hint: emailController.text,
          ),
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
