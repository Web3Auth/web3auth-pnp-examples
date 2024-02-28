import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:web3auth_flutter/enums.dart';

class SideDrawer extends StatelessWidget {
  final ChainConfig selectedChainConfig;

  const SideDrawer({
    super.key,
    required this.selectedChainConfig,
  });

  bool get isEvmChain {
    return selectedChainConfig.chainNamespace == ChainNamespace.eip155;
  }

  @override
  Widget build(BuildContext context) {
    return NavigationDrawer(
      children: [
        ListTile(
          title: Text('Menu'),
        ),
        const Divider(),
        ListTile(
          title: Text("Main Page"),
        ),
        ListTile(
          title: Text("Transactions"),
        ),
        if (isEvmChain) ...[
          ListTile(
            title: Text("Smart Contracts Interaction"),
          ),
        ],
        ListTile(
          title: Text("Disconnect"),
        )
      ],
    );
  }
}
