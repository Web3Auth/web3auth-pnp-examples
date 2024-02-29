import 'package:flutter/material.dart';
import 'package:flutter_playground/core/widgets/custom_filled_buttond.dart';
import 'package:flutter_playground/core/widgets/custom_text_field.dart';

class SendTransactionView extends StatefulWidget {
  final TextEditingController amountController;
  final TextEditingController destinationController;
  final VoidCallback onSend;

  const SendTransactionView({
    super.key,
    required this.amountController,
    required this.destinationController,
    required this.onSend,
  });

  @override
  State<SendTransactionView> createState() => _SendTransactionViewState();
}

class _SendTransactionViewState extends State<SendTransactionView> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Amount'),
          const SizedBox(height: 8),
          CustomTextField(
            textEditingController: widget.amountController,
          ),
          const SizedBox(height: 24),
          const Text('Destination'),
          const SizedBox(height: 8),
          CustomTextField(
            textEditingController: widget.destinationController,
          ),
          const SizedBox(height: 24),
          CustomFilledButton(
            text: "Send Transaction",
            onTap: widget.onSend,
          )
        ],
      ),
    );
  }
}
