const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get all projects directories recursively (excluding node_modules)
function findProjectDirs(dir, excludes = ['node_modules', '.git']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat && stat.isDirectory()) {
      if (excludes.some(exclude => file === exclude)) {
        return;
      }
      
      // Check if the directory has a package.json (considered a project)
      const packageJsonPath = path.join(fullPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        results.push(fullPath);
      }
      
      // Continue recursion
      results = results.concat(findProjectDirs(fullPath, excludes));
    }
  });
  
  return results;
}

// Update .env file in the given directory with the client ID
function updateEnvFile(dir, clientId) {
  const envPath = path.join(dir, '.env');
  let envContent = '';
  
  // Read existing .env file or create a new one
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add the client ID
  const updated = envContent.includes('VITE_WEB3AUTH_CLIENT_ID=')
    ? envContent.replace(/VITE_WEB3AUTH_CLIENT_ID=.*/g, `VITE_WEB3AUTH_CLIENT_ID=${clientId}`)
    : envContent + `\nVITE_WEB3AUTH_CLIENT_ID=${clientId}\n`;
  
  // Write back to the file
  fs.writeFileSync(envPath, updated);
  console.log(`Updated .env with Web3Auth client ID in ${dir}`);
}

// Main execution
rl.question('Enter your Web3Auth Client ID: ', (clientId) => {
  if (!clientId.trim()) {
    console.error('Client ID cannot be empty');
    rl.close();
    return;
  }

  try {
    const rootDir = process.cwd();
    const projectDirs = findProjectDirs(rootDir);
    
    console.log(`Found ${projectDirs.length} projects to update\n`);
    
    projectDirs.forEach(dir => {
      updateEnvFile(dir, clientId);
    });
    
    console.log('\nClient ID set successfully in all examples!');
  } catch (error) {
    console.error('Error updating client ID:', error);
  } finally {
    rl.close();
  }
}); 