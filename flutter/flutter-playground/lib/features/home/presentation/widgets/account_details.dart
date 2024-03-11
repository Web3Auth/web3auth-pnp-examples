import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/widgets/custom_dialog.dart';
import 'package:flutter_playground/core/widgets/custom_text_button.dart';
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
        Row(
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
                      style:
                          Theme.of(context).textTheme.displayMedium?.copyWith(
                                color: Theme.of(context).canvasColor,
                              ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  userInfo.name!,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context)
                      .textTheme
                      .displayLarge
                      ?.copyWith(fontSize: 24, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 4),
                Text(
                  userInfo.email!,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: 4),
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
              ],
            )
          ],
        ),
        const SizedBox(height: 24),
        CustomTextButton(
          onTap: () {
            _showUserDetails(context);
          },
          text: StringConstants.viewUserInfoText,
        ),
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
