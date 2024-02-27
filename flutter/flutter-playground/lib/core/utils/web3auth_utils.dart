import 'dart:io';

Uri resolveRedirectUrl() {
  if (Platform.isAndroid) {
    return Uri.parse('');
  } else {
    return Uri.parse('com.w3a.flutterplayground://auth');
  }
}
