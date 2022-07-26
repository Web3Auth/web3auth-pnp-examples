import 'zone.js';  // Included with Angular CLI.

(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = global.process || require('process');