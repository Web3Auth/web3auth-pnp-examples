import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/presentation/provider/home_provider.dart';
import 'package:flutter_playground/features/home/presentation/screens/smart_contract_interaction_screen.dart';
import 'package:flutter_playground/features/home/presentation/screens/transactions_screen.dart';
import 'package:flutter_playground/features/login/presentation/screens/login_screen.dart';
import 'package:provider/provider.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';

class SideDrawer extends StatefulWidget {
  const SideDrawer({super.key});

  @override
  State<SideDrawer> createState() => _SideDrawerState();
}

class _SideDrawerState extends State<SideDrawer> {
  late final ChainConfig selectedChain;

  @override
  void initState() {
    super.initState();
    selectedChain = context.read<HomeProvider>().selectedChain;
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
      child: Column(
        children: [
          const SizedBox(height: 56),
          const ListTile(
            title: Text('Menu'),
          ),
          const Divider(),
          DrawerTile(
            item: 'Transaction',
            onTap: () {
              _navigateToScreen(context, const TransactionsScreen());
            },
          ),
          if (selectedChain.isEVMChain) ...[
            DrawerTile(
              item: 'Smart Contract Interactions',
              onTap: () {
                _navigateToScreen(
                  context,
                  const SmartContractInteractionScreen(),
                );
              },
            ),
          ],
          DrawerTile(
            item: 'Disconnect',
            onTap: () async {
              await Web3AuthFlutter.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) {
                    return const LoginScreen();
                  }),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  void _navigateToScreen(BuildContext context, screen) {
    if (context.mounted) {
      Navigator.pop(context);
      Navigator.of(context).push(MaterialPageRoute(builder: (_) {
        return screen;
      }));
    }
  }
}

class DrawerTile extends StatelessWidget {
  final String item;

  final VoidCallback onTap;

  const DrawerTile({
    super.key,
    required this.item,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      width: double.infinity,
      child: TextButton(
        onPressed: onTap,
        style: ButtonStyle(
          alignment: Alignment.centerLeft,
          shape: MaterialStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
            ),
          ),
        ),
        child: Text(item),
      ),
    );
  }
}
