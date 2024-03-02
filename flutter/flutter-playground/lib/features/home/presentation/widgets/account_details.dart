import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/widgets/custom_dialog.dart';
import 'package:flutter_playground/features/home/domain/entities/account.dart';
import 'package:web3auth_flutter/output.dart';

class AccountDetails extends StatelessWidget {
  final TorusUserInfo userInfo;
  final Account account;

  const AccountDetails({
    super.key,
    required this.userInfo,
    required this.account,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(
            userInfo.profileImage!,
            errorBuilder: (_, __, ___) {
              return Container(
                width: 120,
                height: 120,
                alignment: Alignment.center,
                color: Theme.of(context).primaryColor,
                child: Text(
                  userInfo.name![0].toUpperCase(),
                  style: Theme.of(context).textTheme.displayMedium?.copyWith(
                        color: Theme.of(context).canvasColor,
                      ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        Text(
          userInfo.name!,
          style: Theme.of(context).textTheme.labelLarge?.copyWith(fontSize: 16),
        ),
        Row(
          children: [
            Text(
              account.publicAddress.addressAbbreviation,
            ),
            const SizedBox(width: 16),
            IconButton(
              onPressed: () {
                copyContentToClipboard(context, account.publicAddress);
              },
              icon: const Icon(
                Icons.copy,
                size: 14,
              ),
            )
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: TextButton(
            onPressed: () {
              _showUserDetails(context);
            },
            style: ButtonStyle(
              backgroundColor: MaterialStatePropertyAll(
                Theme.of(context).hoverColor,
              ),
              shape: MaterialStatePropertyAll(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
            ),
            child: const Text(StringConstants.viewUserInfoText),
          ),
        )
      ],
    );
  }

  void _showUserDetails(BuildContext context) {
    const jsonEncoder = JsonEncoder.withIndent(' ');
    final jsonString = jsonEncoder.convert(userInfo);
    showInfoDialog(
      context,
      "${StringConstants.userInformationText}:\n\n$jsonString",
      true,
    );
  }

  void copyContentToClipboard(BuildContext context, String content) {
    Clipboard.setData(
      ClipboardData(text: content),
    );

    showInfoDialog(
      context,
      "${StringConstants.copiedToClipboardText}\n\n$content",
    );
  }
}
