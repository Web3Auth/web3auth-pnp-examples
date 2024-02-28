import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/presentation/screens/transactions_screen.dart';
import 'package:web3auth_flutter/enums.dart';

class SideDrawer extends StatefulWidget {
  final ChainConfig selectedChainConfig;
  final int defaultIndex;

  const SideDrawer({
    super.key,
    required this.selectedChainConfig,
    required this.defaultIndex,
  });

  @override
  State<SideDrawer> createState() => _SideDrawerState();
}

class _SideDrawerState extends State<SideDrawer> {
  final List<String> drawerItems = [
    'Main Page',
    'Transaction',
    'Smart Contract Interacations',
    'Disconnect',
  ];

  late final ValueNotifier selectedIndex;

  @override
  void initState() {
    super.initState();
    selectedIndex = ValueNotifier(widget.defaultIndex);
  }

  bool get isEvmChain {
    return widget.selectedChainConfig.chainNamespace == ChainNamespace.eip155;
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
          Expanded(
            child: ValueListenableBuilder(
              valueListenable: selectedIndex,
              builder: (_, __, ___) {
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  itemCount: drawerItems.length,
                  itemBuilder: (context, index) {
                    final item = drawerItems[index];

                    if (!widget.selectedChainConfig.isEVMChain && index == 2) {
                      return const Offstage();
                    }

                    return DrawerTile(
                      item: item,
                      isSelected: index == selectedIndex.value,
                      onTap: () {
                        Navigator.of(context)
                            .push(MaterialPageRoute(builder: (_) {
                          return TransactionsScreen(
                              selectedChainConfig: widget.selectedChainConfig);
                        }));
                        selectedIndex.value = index;
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class DrawerTile extends StatelessWidget {
  final String item;
  final bool isSelected;
  final VoidCallback onTap;

  const DrawerTile({
    super.key,
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onTap,
      style: ButtonStyle(
        alignment: Alignment.centerLeft,
        backgroundColor: MaterialStatePropertyAll(
          isSelected ? Theme.of(context).hoverColor : null,
        ),
        shape: MaterialStatePropertyAll(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8.0),
          ),
        ),
      ),
      child: Text(item),
    );
  }
}
