import 'package:flutter/material.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
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
          const Text(StringConstants.erc20ContractAddressText),
          const SizedBox(height: 8),
          CustomTextField(
            textEditingController: widget.contractAddressController,
            hintText: StringConstants.dummyContractAddress.addressAbbreviation,
          ),
          const SizedBox(height: 24),
          CustomFilledButton(
            text: StringConstants.fetchBalanceText,
            onTap: widget.onFetchBalance,
          ),
          const SizedBox(height: 8),
          CustomFilledButton(
            text: StringConstants.getTotalSupplyText,
            onTap: widget.onTotalSupply,
          ),
        ],
      ),
    );
  }
}
