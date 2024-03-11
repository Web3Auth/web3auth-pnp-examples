import 'package:flutter/material.dart';

class CustomTextButton extends StatelessWidget {
  final VoidCallback onTap;
  final String text;

  const CustomTextButton({super.key, required this.onTap, required this.text});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: TextButton(
        onPressed: onTap,
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
        child: Text(text),
      ),
    );
  }
}
