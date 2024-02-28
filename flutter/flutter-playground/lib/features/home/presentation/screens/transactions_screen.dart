import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/widgets/custom_dialog.dart';
import 'package:flutter_playground/features/home/data/datasource/chain_datasource.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/presentation/widgets/send_transaction_view.dart';
import 'package:flutter_playground/features/home/presentation/widgets/sign_message_view.dart';

class TransactionsScreen extends StatefulWidget {
  final ChainConfig selectedChainConfig;

  const TransactionsScreen({
    super.key,
    required this.selectedChainConfig,
  });

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  late final ChainDataSource chainDataSource;
  late final TextEditingController signMessageTextController;
  late final TextEditingController amountTextController;
  late final TextEditingController destinationTextController;

  @override
  void initState() {
    super.initState();
    chainDataSource = widget.selectedChainConfig.prepareDataSource();
    signMessageTextController = TextEditingController(
      text: "Welcome to Web3Auth",
    );
    amountTextController = TextEditingController();
    destinationTextController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text(StringConstants.appBarTitle),
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Text(
                "Signing/Transaction",
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 24),
              const TabBar(
                indicatorSize: TabBarIndicatorSize.tab,
                tabs: [
                  Tab(text: "Sign Message"),
                  Tab(text: "Send Transaction"),
                ],
              ),
              const SizedBox(height: 24),
              Expanded(
                child: TabBarView(
                  children: [
                    SignMessageView(
                      textEditingController: signMessageTextController,
                      onSign: () {
                        _signMessage(context);
                      },
                    ),
                    SendTransactionView(
                      amountController: amountTextController,
                      destinationController: destinationTextController,
                      onSend: () {
                        _sendTransaction(context);
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _signMessage(BuildContext context) async {
    try {
      final signature = await chainDataSource.signMessage(
        signMessageTextController.text,
      );
      if (context.mounted) {
        showInfoDialog(context, signature);
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> _sendTransaction(BuildContext context) async {
    try {
      final amount = double.parse(amountTextController.text);
      final hash = await chainDataSource.sendTransaction(
        destinationTextController.text,
        amount,
      );

      if (context.mounted) {
        showInfoDialog(context, hash);
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        showInfoDialog(context, e.toString());
      }
    }
  }
}
