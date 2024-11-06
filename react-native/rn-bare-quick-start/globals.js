global.Buffer = require("buffer").Buffer;

// eslint-disable-next-line import/first
import { install } from "react-native-quick-crypto";

install();

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: "file:",
};

global.process.version = "v16.0.0";
if (!global.process.version) {
  global.process = require("process");
  // eslint-disable-next-line no-console
  console.log({ process: global.process });
}

process.browser = true;
