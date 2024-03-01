import 'package:flutter/material.dart';
import 'package:flutter_playground/core/widgets/custom_filled_buttond.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/presentation/provider/chain_config_provider.dart';
import 'package:flutter_playground/features/home/presentation/screens/custom_chain_details.dart';
import 'package:provider/provider.dart';

class ChaninSwitcherBottomSheet extends StatefulWidget {
  final Function(ChainConfig) onChainSelected;

  const ChaninSwitcherBottomSheet({
    super.key,
    required this.onChainSelected,
  });

  @override
  State<ChaninSwitcherBottomSheet> createState() =>
      _ChaninSwitcherBottomSheetState();
}

class _ChaninSwitcherBottomSheetState extends State<ChaninSwitcherBottomSheet> {
  late final ChainConfigProvider chainConfigProvider;

  @override
  void initState() {
    super.initState();
    chainConfigProvider = Provider.of(context, listen: false);
  }

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
        Consumer<ChainConfigProvider>(builder: (context, _, __) {
          return Expanded(
            child: ListView.builder(
              itemCount: chainConfigProvider.chains.length,
              itemBuilder: (_, index) {
                final chainConfig = chainConfigProvider.chains[index];
                final selectedChain = chainConfigProvider.selectedChain;
                final isSelected = chainConfig.chainId == selectedChain.chainId;
                return ListTile(
                  selected: isSelected,
                  onTap: () {
                    Navigator.maybePop(_);
                    widget.onChainSelected(chainConfig);
                  },
                  title: Text(chainConfig.displayName),
                );
              },
            ),
          );
        }),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 24),
          child: CustomFilledButton(
            onTap: () async {
              final ChainConfig? chainConfig = await _addNewChain();

              if (chainConfig != null) {
                chainConfigProvider.addNewChain(chainConfig);
              }
            },
            text: "Add Custom Ethereum Chain",
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Future<ChainConfig?> _addNewChain() async {
    return await Navigator.of(context).push(MaterialPageRoute(
      builder: (_) {
        return const CustomChainDetailsScreen();
      },
    ));
  }
}
