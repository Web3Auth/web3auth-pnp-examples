import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';

class ChaninSwitcherBottomSheet extends StatelessWidget {
  final List<ChainConfig> chainConfigs;
  final Function(ChainConfig) onChainSelected;

  const ChaninSwitcherBottomSheet({
    super.key,
    required this.chainConfigs,
    required this.onChainSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 24),
        ListTile(
          title: Text(
            "Switch Chain",
            style: Theme.of(context).textTheme.headlineSmall,
          ),
        ),
        const Divider(endIndent: 16, indent: 16),
        Expanded(
          child: ListView.builder(
            itemCount: chainConfigs.length,
            itemBuilder: (_, index) {
              final chainConfig = chainConfigs[index];
              return ListTile(
                onTap: () {
                  Navigator.maybePop(_);
                  onChainSelected(chainConfig);
                },
                title: Text(chainConfig.displayName),
              );
            },
          ),
        )
      ],
    );
  }
}
