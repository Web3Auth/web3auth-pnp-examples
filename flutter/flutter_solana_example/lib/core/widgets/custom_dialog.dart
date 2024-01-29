import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CustomDialog extends StatelessWidget {
  final Widget child;

  final bool canceable;

  const CustomDialog({
    super.key,
    required this.child,
    this.canceable = false,
  });

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: canceable,
      child: Center(
        child: Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          child: child,
        ),
      ),
    );
  }
}

void showLoader(BuildContext context) {
  showDialog(
    context: context,
    builder: (context) => CustomDialog(
      canceable: false,
      child: SizedBox(
        height: MediaQuery.of(context).size.height * 0.15,
        width: MediaQuery.of(context).size.width * 0.3,
        child: const Center(
          child: CupertinoActivityIndicator(
            radius: 18.0,
          ),
        ),
      ),
    ),
    barrierDismissible: false,
  );
}

showInfoDialog(BuildContext context, String info) {
  showDialog(
    context: context,
    builder: (context) => CustomDialog(
      canceable: true,
      child: SizedBox(
        width: MediaQuery.of(context).size.width / 1.5,
        height: MediaQuery.of(context).size.width / 1.5,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Center(
            child: Text(info),
          ),
        ),
      ),
    ),
    barrierDismissible: true,
  );
}

void removeDialog(BuildContext context) {
  if (Navigator.canPop(context)) {
    Navigator.pop(context);
  }
}
