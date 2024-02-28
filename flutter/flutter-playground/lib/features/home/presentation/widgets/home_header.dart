import 'package:flutter/material.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          "Welcome to Web3Auth Flutter Playground",
          textAlign: TextAlign.center,
          style: Theme.of(context)
              .textTheme
              .headlineMedium
              ?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 48),
        Text(
          "Your account details",
          style: Theme.of(context).textTheme.labelLarge?.copyWith(fontSize: 16),
        ),
      ],
    );
  }
}
