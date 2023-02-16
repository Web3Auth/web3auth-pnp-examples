// global variables required to be replaced for torus packages to work
import { decode, encode } from "base-64";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
if (!global.Buffer) {
  global.Buffer = require("buffer/").Buffer;
}

global.process.version = "v16.0.0";
if (!global.process.version) {
  global.process = require("process");
  console.log({ process: global.process });
}
