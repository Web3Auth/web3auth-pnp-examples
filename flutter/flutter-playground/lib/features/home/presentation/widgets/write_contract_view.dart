import 'package:flutter/material.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/widgets/custom_filled_buttond.dart';
import 'package:flutter_playground/core/widgets/custom_text_field.dart';

class WriteContractView extends StatefulWidget {
  final TextEditingController contractAddressController;
  final TextEditingController spenderAddressController;

  final VoidCallback revokeApproval;

  const WriteContractView({
    super.key,
    required this.contractAddressController,
    required this.revokeApproval,
    required this.spenderAddressController,
  });

  @override
  State<WriteContractView> createState() => _WriteContractViewState();
}

class _WriteContractViewState extends State<WriteContractView> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(StringConstants.erc20ContractAddressText),
          const SizedBox(height: 8),
          CustomTextField(
            hintText: StringConstants.dummyContractAddress.addressAbbreviation,
            textEditingController: widget.contractAddressController,
          ),
          const SizedBox(height: 24),
          const Text(StringConstants.spenderContractAddressText),
          const SizedBox(height: 8),
          CustomTextField(
            hintText: StringConstants.dummyContractAddress.addressAbbreviation,
            textEditingController: widget.spenderAddressController,
          ),
          const SizedBox(height: 24),
          CustomFilledButton(
            text: StringConstants.revokeApprovalText,
            onTap: widget.revokeApproval,
          ),
        ],
      ),
    );
  }
}
