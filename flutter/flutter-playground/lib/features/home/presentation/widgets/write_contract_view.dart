import 'package:flutter/material.dart';
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
          const Text('ERC 20 Contract Address'),
          const SizedBox(height: 8),
          CustomTextField(
            hintText: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
            textEditingController: widget.contractAddressController,
          ),
          const SizedBox(height: 24),
          const Text('Spender Contract Address'),
          const SizedBox(height: 8),
          CustomTextField(
            hintText: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
            textEditingController: widget.spenderAddressController,
          ),
          const SizedBox(height: 24),
          CustomFilledButton(
            text: "Revoke approval",
            onTap: widget.revokeApproval,
          ),
        ],
      ),
    );
  }
}
