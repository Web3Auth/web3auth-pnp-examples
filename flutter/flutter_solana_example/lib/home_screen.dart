import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_solana_example/core/extensions.dart';
import 'package:flutter_solana_example/core/service_locator.dart';
import 'package:flutter_solana_example/core/solana/solana_provider.dart';
import 'package:flutter_solana_example/core/widgets/custom_dialog.dart';
import 'package:flutter_solana_example/login_screen.dart';
import 'package:solana/solana.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final ValueNotifier<bool> isAccountLoaded;
  late final Ed25519HDKeyPair keyPair;
  late final SolanaProvider provider;
  late double balance;

  @override
  void initState() {
    super.initState();
    isAccountLoaded = ValueNotifier<bool>(false);
    provider = ServiceLocator.getIt<SolanaProvider>();
    loadAccount(context);
  }

  Future<void> loadAccount(BuildContext context) async {
    try {
      final privateKey = await Web3AuthFlutter.getEd25519PrivKey();

      /// The ED25519 PrivateKey returns a key pair from
      /// which we only require first 32 byte.
      keyPair = await Ed25519HDKeyPair.fromPrivateKeyBytes(
        privateKey: privateKey.hexToBytes.take(32).toList(),
      );
      balance = await provider.getBalance(keyPair.address);
      isAccountLoaded.value = true;
    } catch (e, _) {
      if (context.mounted) {
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> refreshBalance(BuildContext context) async {
    try {
      isAccountLoaded.value = false;
      balance = await provider.getBalance(keyPair.address);
      isAccountLoaded.value = true;
    } catch (e, _) {
      if (context.mounted) {
        showInfoDialog(context, e.toString());
      }
    }
  }

  Widget get verticalGap => const SizedBox(height: 16);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.logout),
          onPressed: () {
            logOut(context);
          },
        ),
      ),
      body: ValueListenableBuilder<bool>(
        valueListenable: isAccountLoaded,
        builder: (context, isLoaded, _) {
          if (isLoaded) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    balance.toString(),
                    style: Theme.of(context).textTheme.displaySmall,
                  ),
                  verticalGap,
                  Row(
                    children: [
                      const Spacer(),
                      Text(
                        keyPair.address.addressAbbreviation,
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      const SizedBox(
                        width: 4,
                      ),
                      IconButton(
                        onPressed: () {
                          copyContentToClipboard(context, keyPair.address);
                        },
                        icon: const Icon(Icons.copy),
                      ),
                      const Spacer(),
                    ],
                  ),
                  verticalGap,
                  OutlinedButton(
                    onPressed: () {
                      selfTransfer(context);
                    },
                    child: const Text(
                      "Self transfer 0.0001 Sol",
                    ),
                  ),
                  verticalGap,
                  OutlinedButton(
                    onPressed: () {
                      signSelfTransfer(context);
                    },
                    child: const Text(
                      "Sign Self transfer 0.0001 Sol",
                    ),
                  ),
                  verticalGap,
                  OutlinedButton(
                    onPressed: () async {
                      final privateKey =
                          await Web3AuthFlutter.getEd25519PrivKey();
                      if (context.mounted) {
                        copyContentToClipboard(context, privateKey);
                      }
                    },
                    child: const Text(
                      "Copy private ",
                    ),
                  )
                ],
              ),
            );
          }
          return const Center(child: CircularProgressIndicator.adaptive());
        },
      ),
    );
  }

  void copyContentToClipboard(BuildContext context, String content) {
    Clipboard.setData(
      ClipboardData(text: content),
    );

    showInfoDialog(context, "Copied to clipboard\n\n$content");
  }

  Future<void> signSelfTransfer(BuildContext context) async {
    showLoader(context);
    try {
      final signedMessage = await provider.signSendTransaction(
        keyPair: keyPair,
        destination: keyPair.address,
        value: 0.0001,
      );
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, "Signed message\n$signedMessage");
      }
    } catch (e, _) {
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> selfTransfer(BuildContext context) async {
    showLoader(context);
    try {
      final hash = await provider.sendSol(
        destination: keyPair.address,
        keyPair: keyPair,
        value: 0.0001,
      );
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, "Success: $hash");
        refreshBalance(context);
      }
    } catch (e, _) {
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> logOut(BuildContext context) async {
    showLoader(context);

    try {
      await Web3AuthFlutter.logout();
      if (context.mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) {
            return const LoginScreen();
          }),
        );
      }
    } catch (e, _) {
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }
}
