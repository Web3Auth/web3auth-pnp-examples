process.browser = true;

global.Buffer = require('buffer').Buffer;

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:',
};
