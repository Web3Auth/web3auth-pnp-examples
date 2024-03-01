import 'package:flutter/material.dart';
import 'package:flutter_playground/core/utils/strings.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          StringConstants.welcomeText,
          textAlign: TextAlign.center,
          style: Theme.of(context)
              .textTheme
              .headlineMedium
              ?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 48),
        Text(
          StringConstants.yourAccountDetailsText,
          style: Theme.of(context).textTheme.labelLarge?.copyWith(fontSize: 16),
        ),
      ],
    );
  }
}
