// global variables required to be replaced for torus packages to work
import { decode, encode } from "base-64";

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
if (!global.process) {
  global.process = require("process");
  console.log({ process: global.process });
}
