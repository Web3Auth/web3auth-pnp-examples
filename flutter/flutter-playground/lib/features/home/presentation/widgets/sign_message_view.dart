import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_playground/features/home/presentation/widgets/custom_filled_buttond.dart';
import 'package:flutter_playground/features/home/presentation/widgets/custom_text_field.dart';

class SignMessageView extends StatefulWidget {
  final TextEditingController textEditingController;
  final VoidCallback onSign;

  const SignMessageView({
    super.key,
    required this.textEditingController,
    required this.onSign,
  });

  @override
  State<SignMessageView> createState() => _SignMessageViewState();
}

class _SignMessageViewState extends State<SignMessageView> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Message'),
          const SizedBox(height: 8),
          CustomTextField(
            textEditingController: widget.textEditingController,
          ),
          const SizedBox(height: 24),
          CustomFilledButton(
            text: "Sign Message",
            onTap: widget.onSign,
          )
        ],
      ),
    );
  }
}
