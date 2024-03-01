import 'package:flutter/material.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/widgets/custom_filled_buttond.dart';
import 'package:flutter_playground/core/widgets/custom_text_field.dart';

class ReadContractView extends StatefulWidget {
  final TextEditingController contractAddressController;
  final VoidCallback onFetchBalance;
  final VoidCallback onTotalSupply;

  const ReadContractView({
    super.key,
    required this.contractAddressController,
    required this.onFetchBalance,
    required this.onTotalSupply,
  });

  @override
  State<ReadContractView> createState() => _ReadContractViewState();
}

class _ReadContractViewState extends State<ReadContractView> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('ERC 20 Contract Address'),
          const SizedBox(height: 8),
          CustomTextField(
            textEditingController: widget.contractAddressController,
            hintText: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'
                .addressAbbreviation,
          ),
          const SizedBox(height: 24),
          CustomFilledButton(
            text: "Fetch balance",
            onTap: widget.onFetchBalance,
          ),
          const SizedBox(height: 8),
          CustomFilledButton(
            text: "Get total supply",
            onTap: widget.onTotalSupply,
          ),
        ],
      ),
    );
  }
}
