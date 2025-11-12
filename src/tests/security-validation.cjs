// Simple security validation tests
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Import security check functions
const { SENSITIVE_PATTERNS, BLOCKED_FILES, isBlockedFile } = require('../../scripts/security-check.cjs')

function runTest(description, testFn) {
  try {
    testFn()
    console.log(`✅ ${description}`)
    return true
  } catch (error) {
    console.error(`❌ ${description}`)
    console.error(`   ${error.message}`)
    return false
  }
}

function expect(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`)
  }
}

function expectContains(actual, expected, message) {
  if (!actual.includes(expected)) {
    throw new Error(message || `Expected to contain ${expected}`)
  }
}

function expectTruthy(actual, message) {
  if (!actual) {
    throw new Error(message || `Expected truthy value, got ${actual}`)
  }
}

function expectFalsy(actual, message) {
  if (actual) {
    throw new Error(message || `Expected falsy value, got ${actual}`)
  }
}

console.log('🧪 Running Security Tests...\n')

let passedTests = 0
let totalTests = 0

// Test 1: Check if sensitive patterns detect private keys
totalTests++
if (runTest('Should detect private keys in content', () => {
  const privateKeyContent = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQlUaKyUcGXYBg
-----END PRIVATE KEY-----`
  
  const hasPrivateKey = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(privateKeyContent)
  )
  
  expectTruthy(hasPrivateKey)
})) passedTests++

// Test 2: Check if sensitive patterns detect API keys
totalTests++
if (runTest('Should detect Firebase API keys', () => {
  const apiKeyContent = 'VITE_FIREBASE_API_KEY=AIzaSyD-j7hx_KPdJrB9idFXRQbO_cpS4MVnw_s'
  
  const hasApiKey = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(apiKeyContent)
  )
  
  expectTruthy(hasApiKey)
})) passedTests++

// Test 3: Check if sensitive patterns detect service account emails
totalTests++
if (runTest('Should detect service account emails', () => {
  const serviceAccountContent = 'firebase-adminsdk-fbsvc@financeiro-ctr.iam.gserviceaccount.com'
  
  const hasServiceAccount = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(serviceAccountContent)
  )
  
  expectTruthy(hasServiceAccount)
})) passedTests++

// Test 4: Check if blocked files are detected
totalTests++
if (runTest('Should block Firebase service account files', () => {
  expectTruthy(isBlockedFile('firebase-adminsdk-abcd1234.json'))
  expectTruthy(isBlockedFile('service-account-key.json'))
  expectTruthy(isBlockedFile('credentials.json'))
  expectFalsy(isBlockedFile('normal-file.js'))
})) passedTests++

// Test 5: Check if .env is in .gitignore
totalTests++
if (runTest('Should have .env in .gitignore', () => {
  const gitignorePath = path.join(__dirname, '..', '..', '.gitignore')
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
  
  expectContains(gitignoreContent, '.env')
  expectContains(gitignoreContent, '*firebase-adminsdk*.json')
})) passedTests++

// Test 6: Check if .env.example exists and is safe
totalTests++
if (runTest('Should have safe .env.example template', () => {
  const envExamplePath = path.join(__dirname, '..', '..', '.env.example')
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8')
  
  expectContains(envExampleContent, 'your_api_key_here')
  expectContains(envExampleContent, 'your_project_id')
  
  // Should not contain real API key patterns
  if (envExampleContent.includes('AIzaSy')) {
    throw new Error('Contains real API key pattern')
  }
})) passedTests++

// Test 7: Check if security check script exists
totalTests++
if (runTest('Should have security check script', () => {
  const securityScriptPath = path.join(__dirname, '..', '..', 'scripts', 'security-check.cjs')
  expectTruthy(fs.existsSync(securityScriptPath))
  
  const scriptContent = fs.readFileSync(securityScriptPath, 'utf8')
  expectContains(scriptContent, 'SENSITIVE_PATTERNS')
  expectContains(scriptContent, 'BLOCKED_FILES')
})) passedTests++

// Test 8: Check if pre-commit hook exists
totalTests++
if (runTest('Should have pre-commit hook', () => {
  const preCommitHookPath = path.join(__dirname, '..', '..', '.git', 'hooks', 'pre-commit')
  const preCommitBatPath = path.join(__dirname, '..', '..', '.git', 'hooks', 'pre-commit.bat')
  
  // Check if at least one version exists
  const hookExists = fs.existsSync(preCommitHookPath) || fs.existsSync(preCommitBatPath)
  expectTruthy(hookExists)
})) passedTests++

// Test 9: Check if .gitignore blocks sensitive files
totalTests++
if (runTest('Should block sensitive file patterns in .gitignore', () => {
  const gitignorePath = path.join(__dirname, '..', '..', '.gitignore')
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
  
  const requiredPatterns = [
    '*firebase-adminsdk*.json',
    '*service-account*.json',
    '.env',
    '*.pem',
    '*.key'
  ]
  
  requiredPatterns.forEach(pattern => {
    if (!gitignoreContent.includes(pattern)) {
      throw new Error(`Missing pattern in .gitignore: ${pattern}`)
    }
  })
})) passedTests++

// Test 10: Validate that service account file is ignored
totalTests++
if (runTest('Should ignore Firebase service account file', () => {
  try {
    const result = execSync('git check-ignore financeiro-ctr-firebase-adminsdk-fbsvc-15b6864cef.json', { encoding: 'utf8' })
    expect(result.trim(), 'financeiro-ctr-firebase-adminsdk-fbsvc-15b6864cef.json')
  } catch (error) {
    throw new Error('Firebase service account file is not being ignored by git')
  }
})) passedTests++

console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed\n`)

if (passedTests === totalTests) {
  console.log('✅ All security tests passed! 🛡️')
  console.log('\n🔒 Security measures implemented:')
  console.log('   • Firebase service account files are blocked from commits')
  console.log('   • Sensitive patterns are detected in code')
  console.log('   • Pre-commit hooks validate security before commits')
  console.log('   • Environment variables are properly templated')
  console.log('   • .gitignore blocks all sensitive file patterns')
  console.log('\n📝 Next steps:')
  console.log('   1. Review FIREBASE_SETUP.md for Firebase configuration')
  console.log('   2. Ensure all team members run setup-hooks.bat')
  console.log('   3. Regular security audits of committed code')
  process.exit(0)
} else {
  console.log('❌ Some security tests failed!')
  process.exit(1)
}