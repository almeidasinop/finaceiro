#!/usr/bin/env node

/**
 * Security Check Script
 * Pre-commit hook to prevent committing sensitive credentials
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to detect sensitive data
const SENSITIVE_PATTERNS = [
  /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/,
  /-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----/,
  /-----BEGIN\s+CERTIFICATE-----/,
  /firebase-adminsdk-[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.iam\.gserviceaccount\.com/,
  /AIza[0-9A-Za-z\-_]{35}/, // Firebase API Key pattern
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, // UUID patterns
  /password\s*[:=]\s*["'][^"']+["']/i,
  /secret\s*[:=]\s*["'][^"']+["']/i,
  /token\s*[:=]\s*["'][^"']+["']/i,
];

// Files to always block
const BLOCKED_FILES = [
  '*firebase-adminsdk*.json',
  '*service-account*.json',
  '*.pem',
  '*.key',
  '*.p12',
  '*.pfx',
  '.env.production',
  'credentials.json',
  'serviceAccountKey.json'
];

// Get staged files
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('❌ Error getting staged files:', error.message);
    return [];
  }
}

// Check file content for sensitive patterns
function checkFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(content)) {
        return {
          hasSensitiveData: true,
          pattern: pattern.toString(),
          line: content.split('\n').findIndex(line => pattern.test(line)) + 1
        };
      }
    }
    
    return { hasSensitiveData: false };
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return { hasSensitiveData: false, error: true };
  }
}

// Check if filename matches blocked patterns
function isBlockedFile(filename) {
  return BLOCKED_FILES.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(filename);
  });
}

// Main security check
function runSecurityCheck() {
  console.log('🔍 Running security check...\n');
  
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('✅ No files to check.');
    return 0;
  }
  
  let hasIssues = false;
  
  for (const file of stagedFiles) {
    console.log(`Checking: ${file}`);
    
    // Check if file is blocked
    if (isBlockedFile(file)) {
      console.error(`❌ BLOCKED FILE: ${file}`);
      console.error('   This file type is not allowed to be committed.');
      hasIssues = true;
      continue;
    }
    
    // Check file content
    const checkResult = checkFileContent(file);
    if (checkResult.hasSensitiveData) {
      console.error(`❌ SENSITIVE DATA FOUND in ${file}`);
      console.error(`   Pattern: ${checkResult.pattern}`);
      console.error(`   Line: ${checkResult.line}`);
      hasIssues = true;
    } else if (!checkResult.error) {
      console.log(`✅ ${file} - Clean`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (hasIssues) {
    console.error('❌ SECURITY CHECK FAILED!');
    console.error('   Sensitive data or blocked files detected.');
    console.error('   Please remove sensitive information before committing.');
    console.error('\n🛡️  Security Tips:');
    console.error('   - Use environment variables for API keys');
    console.error('   - Add sensitive files to .gitignore');
    console.error('   - Use .env.example as template for configuration');
    console.error('   - Never commit service account keys or private keys');
    return 1;
  } else {
    console.log('✅ SECURITY CHECK PASSED!');
    console.log('   No sensitive data detected.');
    return 0;
  }
}

// Run the check
if (require.main === module) {
  process.exit(runSecurityCheck());
}

module.exports = { runSecurityCheck, SENSITIVE_PATTERNS, BLOCKED_FILES };