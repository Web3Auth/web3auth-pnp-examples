import 'package:hex/hex.dart';

extension StringExtension on String {
  List<int> get hexToBytes => HEX.decode(this);

  String get addressAbbreviation =>
      "${substring(0, 4)}...${substring(length - 4, length)}";

  bool get isValidEmail {
    final regex = RegExp(
      r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$",
    );
    return regex.hasMatch(this);
  }
}
