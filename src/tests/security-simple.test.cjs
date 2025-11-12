// Simple security validation tests
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Import security check functions
const { SENSITIVE_PATTERNS, BLOCKED_FILES, isBlockedFile } = require('../../scripts/security-check.cjs')

function test(description, testFn) {
  try {
    testFn()
    console.log(`✅ ${description}`)
  } catch (error) {
    console.error(`❌ ${description}`)
    console.error(`   ${error.message}`)
    process.exit(1)
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`)
      }
    },
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected to contain ${expected}`)
      }
    },
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${actual}`)
      }
    },
    toBeFalsy: () => {
      if (actual) {
        throw new Error(`Expected falsy value, got ${actual}`)
      }
    }
  }
}

console.log('🧪 Running Security Tests...\n')

// Test 1: Check if sensitive patterns detect private keys
test('Should detect private keys in content', () => {
  const privateKeyContent = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQlUaKyUcGXYBg
-----END PRIVATE KEY-----`
  
  const hasPrivateKey = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(privateKeyContent)
  )
  
  expect(hasPrivateKey).toBeTruthy()
})

// Test 2: Check if sensitive patterns detect API keys
test('Should detect Firebase API keys', () => {
  const apiKeyContent = 'VITE_FIREBASE_API_KEY=AIzaSyD-j7hx_KPdJrB9idFXRQbO_cpS4MVnw_s'
  
  const hasApiKey = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(apiKeyContent)
  )
  
  expect(hasApiKey).toBeTruthy()
})

// Test 3: Check if sensitive patterns detect service account emails
test('Should detect service account emails', () => {
  const serviceAccountContent = 'firebase-adminsdk-fbsvc@financeiro-ctr.iam.gserviceaccount.com'
  
  const hasServiceAccount = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(serviceAccountContent)
  )
  
  expect(hasServiceAccount).toBeTruthy()
})

// Test 4: Check if blocked files are detected
test('Should block Firebase service account files', () => {
  expect(isBlockedFile('firebase-adminsdk-abcd1234.json')).toBeTruthy()
  expect(isBlockedFile('service-account-key.json')).toBeTruthy()
  expect(isBlockedFile('credentials.json')).toBeTruthy()
  expect(isBlockedFile('normal-file.js')).toBeFalsy()
})

// Test 5: Check if .env is in .gitignore
test('Should have .env in .gitignore', () => {
  const gitignorePath = path.join(__dirname, '..', '..', '.gitignore')
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
  
  expect(gitignoreContent).toContain('.env')
  expect(gitignoreContent).toContain('*firebase-adminsdk*.json')
})

// Test 6: Check if .env.example exists and is safe
test('Should have safe .env.example template', () => {
  const envExamplePath = path.join(__dirname, '..', '..', '.env.example')
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8')
  
  expect(envExampleContent).toContain('your_api_key_here')
  expect(envExampleContent).toContain('your_project_id')
  expect(envExampleContent).not.toContain('AIzaSy') // Real API key pattern
})

// Test 7: Check if security check script exists
test('Should have security check script', () => {
  const securityScriptPath = path.join(__dirname, '..', '..', 'scripts', 'security-check.js')
  expect(fs.existsSync(securityScriptPath)).toBeTruthy()
  
  const scriptContent = fs.readFileSync(securityScriptPath, 'utf8')
  expect(scriptContent).toContain('SENSITIVE_PATTERNS')
  expect(scriptContent).toContain('BLOCKED_FILES')
})

// Test 8: Check if pre-commit hook exists
test('Should have pre-commit hook', () => {
  const preCommitHookPath = path.join(__dirname, '..', '..', '.git', 'hooks', 'pre-commit')
  const preCommitBatPath = path.join(__dirname, '..', '..', '.git', 'hooks', 'pre-commit.bat')
  
  // Check if at least one version exists
  const hookExists = fs.existsSync(preCommitHookPath) || fs.existsSync(preCommitBatPath)
  expect(hookExists).toBeTruthy()
})

// Test 9: Check if .gitignore blocks sensitive files
test('Should block sensitive file patterns in .gitignore', () => {
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
})

// Test 10: Validate that service account file is ignored
test('Should ignore Firebase service account file', () => {
  try {
    const result = execSync('git check-ignore financeiro-ctr-firebase-adminsdk-fbsvc-15b6864cef.json', { encoding: 'utf8' })
    expect(result.trim()).toBe('financeiro-ctr-firebase-adminsdk-fbsvc-15b6864cef.json')
  } catch (error) {
    throw new Error('Firebase service account file is not being ignored by git')
  }
})

console.log('\n✅ All security tests passed! 🛡️')
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