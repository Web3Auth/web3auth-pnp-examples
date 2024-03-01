import 'package:flutter/material.dart';
import 'package:flutter_playground/core/widgets/custom_filled_buttond.dart';
import 'package:flutter_playground/core/widgets/custom_text_field.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:web3auth_flutter/enums.dart';

class CustomChainDetailsScreen extends StatefulWidget {
  const CustomChainDetailsScreen({super.key});

  @override
  State<CustomChainDetailsScreen> createState() =>
      _CustomChainDetailsScreenState();
}

class _CustomChainDetailsScreenState extends State<CustomChainDetailsScreen> {
  late final GlobalKey<FormState> formKey;
  late final TextEditingController displayNameController;
  late final TextEditingController rpcTargetController;
  late final TextEditingController chainIdController;
  late final TextEditingController blockExplorerController;
  late final TextEditingController tickerController;

  @override
  void initState() {
    super.initState();
    formKey = GlobalKey<FormState>();
    displayNameController = TextEditingController();
    rpcTargetController = TextEditingController();
    chainIdController = TextEditingController();
    blockExplorerController = TextEditingController();
    tickerController = TextEditingController();
  }

  Widget get verticalGap => const SizedBox(height: 8);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Custom chain details'),
      ),
      body: SingleChildScrollView(
        child: Form(
          key: formKey,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              vertical: 16.0,
              horizontal: 8,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                verticalGap,
                const Text('Display name'),
                verticalGap,
                CustomTextField(
                  hintText: 'Arbitrum Sep...',
                  textEditingController: displayNameController,
                  validator: _validator,
                ),
                const SizedBox(height: 24),
                const Text('Native chain ticker'),
                verticalGap,
                CustomTextField(
                  hintText: 'AET...',
                  textEditingController: tickerController,
                  validator: _validator,
                ),
                const SizedBox(height: 24),
                const Text('Chain id'),
                verticalGap,
                CustomTextField(
                  hintText: '0x414..',
                  textEditingController: chainIdController,
                  validator: _validator,
                ),
                const SizedBox(height: 24),
                const Text('RPC url'),
                verticalGap,
                CustomTextField(
                  hintText: 'https://sepolia...',
                  textEditingController: rpcTargetController,
                  validator: _validator,
                ),
                const SizedBox(height: 24),
                const Text('Blockchain explorer'),
                verticalGap,
                CustomTextField(
                  hintText: 'https://sepolia.ar...',
                  textEditingController: blockExplorerController,
                  validator: _validator,
                ),
                const SizedBox(height: 24),
                CustomFilledButton(
                  text: "Add chain",
                  onTap: () {
                    _addChain(context);
                  },
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  String? _validator(String? value) {
    if (value != null && value.isNotEmpty) {
      return null;
    }

    return "Please enter valid value";
  }

  void _addChain(BuildContext context) {
    if (formKey.currentState!.validate()) {
      final chainConfig = ChainConfig(
        isEVMChain: true,
        chainNamespace: ChainNamespace.eip155,
        displayName: displayNameController.text,
        ticker: tickerController.text,
        rpcTarget: rpcTargetController.text,
        blockExplorerUrl: blockExplorerController.text,
        logo: '',
        chainId: chainIdController.text,
        wss: "",
      );
      Navigator.pop(context, chainConfig);
    }
  }
}
