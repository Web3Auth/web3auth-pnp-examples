/* eslint-disable @typescript-eslint/no-var-requires */
import "zone.js"; // Included with Angular CLI.

// IMP START - Bundler Issues
(window as any).global = window;
global.Buffer = global.Buffer || require("buffer").Buffer;
global.process = global.process || require("process");
// IMP END - Bundler Issues
