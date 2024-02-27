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
          child: CircularProgressIndicator.adaptive(),
        ),
      ),
    ),
    barrierDismissible: false,
  );
}

showInfoDialog(
  BuildContext context,
  String info, [
  bool isFullScreenDialog = false,
]) {
  final screenWidth = MediaQuery.of(context).size.width;
  final screenHeight = MediaQuery.of(context).size.height;
  final width = isFullScreenDialog ? screenWidth / 1.2 : screenWidth / 1.5;
  final height = isFullScreenDialog ? screenHeight / 1.2 : screenWidth / 1.5;

  showDialog(
    context: context,
    builder: (context) => CustomDialog(
      canceable: true,
      child: SizedBox(
        width: width,
        height: height,
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                IconButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  icon: const Icon(
                    Icons.close,
                    size: 18,
                  ),
                ),
                const Divider(),
                const SizedBox(
                  height: 8,
                ),
                Center(
                  child: Text(info),
                )
              ],
            ),
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
