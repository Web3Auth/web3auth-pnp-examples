import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/presentation/provider/home_provider.dart';
import 'package:flutter_playground/features/home/presentation/widgets/chain_switcher.dart';
import 'package:provider/provider.dart';

class ChainSwitchTile extends StatelessWidget {
  final Function(ChainConfig) onSelect;

  const ChainSwitchTile({
    super.key,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () {
        showModalBottomSheet(
          context: context,
          builder: (context) {
            return ChaninSwitcherBottomSheet(
              onChainSelected: onSelect,
            );
          },
        );
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 4,
        ),
        decoration: BoxDecoration(
          border: Border.all(width: 0.5),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              context.watch<HomeProvider>().selectedChain.displayName,
            ),
            const Icon(Icons.arrow_drop_down)
          ],
        ),
      ),
    );
  }
}
