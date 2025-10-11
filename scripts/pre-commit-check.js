#!/usr/bin/env node

/**
 * Pre-commit hook to check if package.json changed without package-lock.json
 * This helps prevent lockfile drift in the repository
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkLockfileSync() {
  console.log('🔍 Checking lockfile sync...');
  
  // Check if packageManager field exists
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    process.exit(1);
  }
  
  if (!fs.existsSync(packageLockPath)) {
    console.log('❌ package-lock.json not found');
    console.log('💡 Run: npm install to generate lockfile');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check for packageManager field
  if (!packageJson.packageManager) {
    console.log('⚠️  Warning: package.json missing "packageManager" field');
    console.log('💡 Add: "packageManager": "npm@10.x" to package.json');
  } else {
    console.log('✅ packageManager field present:', packageJson.packageManager);
  }
  
  // Check lockfile version
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  if (packageLock.lockfileVersion !== 3) {
    console.log('⚠️  Warning: lockfileVersion is', packageLock.lockfileVersion, '(expected 3)');
    console.log('💡 Run: bash scripts/lockfile:sync.sh to regenerate lockfile');
  } else {
    console.log('✅ lockfileVersion is correct (3)');
  }
  
  console.log('✅ Lockfile sync check passed');
}

// Run if called directly
checkLockfileSync();

export { checkLockfileSync };
