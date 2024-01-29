import 'package:hex/hex.dart';

extension StringExtension on String {
  List<int> get hexToBytes => HEX.decode(this);

  String get addressAbbreviation =>
      "${substring(0, 4)}...${substring(length - 4, length)}";
}