import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_playground/core/chain_provider.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/widgets/custom_dialog.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/presentation/provider/home_provider.dart';
import 'package:flutter_playground/features/home/presentation/widgets/read_contract_view.dart';
import 'package:flutter_playground/features/home/presentation/widgets/write_contract_view.dart';
import 'package:provider/provider.dart';
import 'package:web3dart/credentials.dart';

class SmartContractInteractionScreen extends StatefulWidget {
  const SmartContractInteractionScreen({super.key});

  @override
  State<SmartContractInteractionScreen> createState() =>
      _SmartContractInteractionScreenState();
}

class _SmartContractInteractionScreenState
    extends State<SmartContractInteractionScreen> {
  late final ChainConfig selectedChain;
  late final ChainProvider chainProvider;
  late final TextEditingController contractAddressTextController;
  late final TextEditingController spenderAddressTextController;

  @override
  void initState() {
    super.initState();
    selectedChain = context.read<HomeProvider>().selectedChain;
    chainProvider = selectedChain.prepareChainProvider();
    contractAddressTextController = TextEditingController();
    spenderAddressTextController = TextEditingController();
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
                StringConstants.smartContractInteractionsText,
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 24),
              const TabBar(
                indicatorSize: TabBarIndicatorSize.tab,
                tabs: [
                  Tab(text: StringConstants.readFromContractText),
                  Tab(text: StringConstants.writeToContractText),
                ],
              ),
              const SizedBox(height: 24),
              Expanded(
                child: TabBarView(
                  children: [
                    ReadContractView(
                      contractAddressController: contractAddressTextController,
                      onFetchBalance: () {
                        _fetchBalance();
                      },
                      onTotalSupply: () {
                        _getTotalSupply();
                      },
                    ),
                    WriteContractView(
                      revokeApproval: () {
                        _revokeApproval();
                      },
                      contractAddressController: contractAddressTextController,
                      spenderAddressController: spenderAddressTextController,
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

  Future<void> _revokeApproval() async {
    try {
      showLoader(context);
      final result = await chainProvider.writeContract(
        contractAddressTextController.text,
        'approve',
        [
          EthereumAddress.fromHex(spenderAddressTextController.text),
          BigInt.zero
        ],
      );
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(
          context,
          "${StringConstants.revokeTransactionHashText}:\n\n$result",
        );
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> _fetchBalance() async {
    try {
      showLoader(context);
      final userAddress = context.read<HomeProvider>().chainAddress;
      final result = await chainProvider.readContract(
        contractAddressTextController.text,
        'balanceOf',
        [EthereumAddress.fromHex(userAddress)],
      );
      log(result.toString());
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(
          context,
          "${StringConstants.balanceText}:\n\n${result.first}",
        );
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> _getTotalSupply() async {
    try {
      showLoader(context);
      final result = await chainProvider.readContract(
        contractAddressTextController.text,
        'totalSupply',
        [],
      );
      log(result.toString());
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(
          context,
          "${StringConstants.totalSupplyText}:\n\n${result.first}",
        );
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }
}
