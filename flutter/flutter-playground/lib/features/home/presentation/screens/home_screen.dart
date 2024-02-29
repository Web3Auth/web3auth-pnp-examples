import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_playground/core/service_locator.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/features/home/domain/entities/account.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/domain/repositories/chain_config_repostiory.dart';
import 'package:flutter_playground/features/home/presentation/widgets/account_details.dart';
import 'package:flutter_playground/features/home/presentation/widgets/balance_widget.dart';
import 'package:flutter_playground/core/widgets/drawer.dart';
import 'package:flutter_playground/features/home/presentation/widgets/chain_switcher_tile.dart';
import 'package:flutter_playground/features/home/presentation/widgets/home_header.dart';
import 'package:web3auth_flutter/output.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final ChainConfigRepository chainConfigRepository;
  late final List<ChainConfig> chainConfigs;
  late final TorusUserInfo userInfo;

  late final ValueNotifier<ChainConfig> selectedChainConfig;
  late final StreamController<Account> streamController;

  @override
  void initState() {
    super.initState();
    chainConfigRepository = ServiceLocator.getIt<ChainConfigRepository>();
    chainConfigs = chainConfigRepository.prepareChains();
    selectedChainConfig = ValueNotifier(chainConfigs.first);
    streamController = StreamController<Account>();
    loadAccount(false);
  }

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> loadAccount(bool isReload) async {
    if (!isReload) {
      userInfo = await Web3AuthFlutter.getUserInfo();
    }
    final account = await chainConfigRepository.prepareAccount(
      selectedChainConfig.value,
    );
    streamController.add(account);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(StringConstants.appBarTitle),
      ),
      drawer: ValueListenableBuilder(
        valueListenable: selectedChainConfig,
        builder: (_, __, ___) {
          return SideDrawer(
            selectedChainConfig: selectedChainConfig.value,
          );
        },
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
        child: StreamBuilder<Account>(
          stream: streamController.stream,
          builder: (context, snapShot) {
            if (snapShot.connectionState == ConnectionState.active) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  const HomeHeader(),
                  const SizedBox(height: 12),
                  ValueListenableBuilder(
                    valueListenable: selectedChainConfig,
                    builder: (_, __, ___) {
                      return ChainSwitchTile(
                        selectedChainConfig: selectedChainConfig.value,
                        chainConfigs: chainConfigs,
                        onSelect: (chainConfig) {
                          selectedChainConfig.value = chainConfig;
                          loadAccount(true);
                        },
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 16),
                  AccountDetails(
                    userInfo: userInfo,
                    account: snapShot.requireData,
                  ),
                  const SizedBox(height: 24),
                  BalanceWidget(
                    balance: snapShot.data!.balance,
                    ticker: selectedChainConfig.value.ticker,
                    chainId: selectedChainConfig.value.chainId,
                  ),
                ],
              );
            }
            return const Center(child: CircularProgressIndicator.adaptive());
          },
        ),
      ),
    );
  }
}
