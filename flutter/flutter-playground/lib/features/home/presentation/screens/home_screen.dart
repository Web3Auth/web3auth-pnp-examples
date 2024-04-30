import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_playground/core/service_locator.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/features/home/domain/entities/account.dart';
import 'package:flutter_playground/features/home/domain/repositories/chain_config_repostiory.dart';
import 'package:flutter_playground/features/home/presentation/provider/home_provider.dart';
import 'package:flutter_playground/features/home/presentation/screens/smart_contract_interaction_screen.dart';
import 'package:flutter_playground/features/home/presentation/screens/transactions_screen.dart';
import 'package:flutter_playground/features/home/presentation/widgets/account_details.dart';
import 'package:flutter_playground/features/home/presentation/widgets/balance_widget.dart';
import 'package:flutter_playground/features/home/presentation/widgets/chain_switcher_tile.dart';
import 'package:flutter_playground/features/home/presentation/widgets/home_header.dart';
import 'package:flutter_playground/features/login/presentation/screens/login_screen.dart';
import 'package:provider/provider.dart';
import 'package:web3auth_flutter/output.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final ChainConfigRepository chainConfigRepository;
  late final TorusUserInfo userInfo;

  late final StreamController<Account> streamController;
  late Stream<Account> stream;
  late final HomeProvider homeProvider;
  late final ValueNotifier selectedIndex;

  @override
  void initState() {
    super.initState();
    chainConfigRepository = ServiceLocator.getIt<ChainConfigRepository>();
    selectedIndex = ValueNotifier(0);
    streamController = StreamController<Account>();
    stream = streamController.stream.asBroadcastStream();
    homeProvider = Provider.of<HomeProvider>(
      context,
      listen: false,
    );
    loadAccount(false);
  }

  @override
  void dispose() {
    super.dispose();
  }

  // loadAccount function is used to fetch the account
  // details such as balance, user address, and private key
  // for currently selected chain.
  Future<void> loadAccount(bool isReload) async {
    if (!isReload) {
      userInfo = await Web3AuthFlutter.getUserInfo();
    }

    final account = await chainConfigRepository.prepareAccount(
      homeProvider.selectedChain,
    );

    homeProvider.updateChainAddress(account.publicAddress);
    // We streamController to control data flow in the application.
    streamController.add(account);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(StringConstants.appBarTitle),
        actions: [
          IconButton(
            onPressed: () async {
              await Web3AuthFlutter.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) {
                    return const LoginScreen();
                  }),
                );
              }
            },
            icon: const Icon(Icons.exit_to_app),
          )
        ],
      ),
      bottomNavigationBar: ValueListenableBuilder(
        valueListenable: selectedIndex,
        builder: (context, _, __) {
          return Consumer<HomeProvider>(builder: (context, value, _) {
            return BottomNavigationBar(
              items: <BottomNavigationBarItem>[
                const BottomNavigationBarItem(
                  icon: Icon(Icons.home),
                  label: 'Home',
                ),
                const BottomNavigationBarItem(
                  icon: Icon(Icons.key),
                  label: 'Sign',
                ),
                // Disable the SmartContractInteractionScreen for
                // non evm chains.

                if (value.selectedChain.isEVMChain) ...[
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.edit_document),
                    label: 'Smart Contracts',
                  )
                ]
              ],
              currentIndex: selectedIndex.value,
              onTap: (index) {
                selectedIndex.value = index;
              },
            );
          });
        },
      ),
      body: StreamBuilder(
          stream: streamController.stream,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.active) {
              return ValueListenableBuilder(
                valueListenable: selectedIndex,
                builder: (context, index, __) {
                  if (index == 0) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 24.0, vertical: 16),
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 24),
                            const HomeHeader(),
                            const SizedBox(height: 12),
                            // Helps users to switch chain in the wallet.
                            ChainSwitchTile(
                              onSelect: (chainConfig) {
                                homeProvider.updateSelectedChain(chainConfig);
                                loadAccount(true);
                              },
                            ),
                            const SizedBox(height: 16),
                            const Divider(),
                            const SizedBox(height: 16),
                            // Displays user details, such as email,
                            // user name, and logo.
                            AccountDetails(
                              userInfo: userInfo,
                              account: snapshot.requireData,
                            ),
                            const SizedBox(height: 24),
                            Consumer<HomeProvider>(builder: (
                              _,
                              homeProvider,
                              __,
                            ) {
                              final chain = homeProvider.selectedChain;
                              // Displays user balance.
                              return BalanceWidget(
                                balance: snapshot.data!.balance,
                                ticker: chain.ticker,
                                chainId: chain.chainId,
                              );
                            }),
                          ],
                        ),
                      ),
                    );
                  } else if (index == 1) {
                    return const TransactionsScreen();
                  } else {
                    return const SmartContractInteractionScreen();
                  }
                },
              );
            }
            return const Center(child: CircularProgressIndicator.adaptive());
          }),
    );
  }

  // Helper function to navigate to different screens.
  void _navigationToScreen(BuildContext context, Widget screen) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) {
      return screen;
    }));
  }
}
