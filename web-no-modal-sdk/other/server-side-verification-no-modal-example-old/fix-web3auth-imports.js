const fs = require('fs');
const path = require('path');

// Path to the problematic file
const authJsPath = path.resolve(
  __dirname,
  'node_modules/@web3auth/no-modal/node_modules/@web3auth/auth/dist/lib.cjs/core/auth.js'
);

// Check if the file exists
if (fs.existsSync(authJsPath)) {
  // Read the file content
  let content = fs.readFileSync(authJsPath, 'utf8');
  
  // Find and replace require('color') with dynamic import
  content = content.replace(
    /require\((['"])color\1\)/g,
    'await import($1color$1).then(m => m.default || m)'
  );
  
  // Write back to the file
  fs.writeFileSync(authJsPath, content);
  
  console.log('Successfully patched Web3Auth import issue!');
} else {
  console.error('Could not find the specified auth.js file. Path may have changed.');
} 