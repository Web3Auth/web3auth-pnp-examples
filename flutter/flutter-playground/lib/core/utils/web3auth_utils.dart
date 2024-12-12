import 'dart:io';

Uri resolveRedirectUrl() {
  if (Platform.isAndroid) {
    return Uri.parse('w3a://com.example.flutterplayground');
  } else {
    return Uri.parse('com.w3a.flutterplayground://auth');
  }
}
