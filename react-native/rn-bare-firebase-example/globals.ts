import {install} from 'react-native-quick-crypto';

install();

// Needed so that 'stream-http' chooses the right default protocol.
// @ts-ignore
global.location = {
  protocol: 'file:',
};
// @ts-ignore
global.process.version = 'v16.0.0';
if (!global.process.version) {
  global.process = require('process');
  console.log({process: global.process});
}
// @ts-ignore
process.browser = true;
