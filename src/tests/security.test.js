import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

describe('Security Tests', () => {
  const testDir = path.join(__dirname, 'temp-security-test')
  
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
  })
  
  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true })
    }
  })
  
  describe('Credential Detection', () => {
    it('should detect Firebase service account files', () => {
      const { isBlockedFile } = require('../scripts/security-check.js')
      
      expect(isBlockedFile('firebase-adminsdk-abcd1234.json')).toBe(true)
      expect(isBlockedFile('service-account-key.json')).toBe(true)
      expect(isBlockedFile('credentials.json')).toBe(true)
      expect(isBlockedFile('normal-file.js')).toBe(false)
    })
    
    it('should detect private keys in content', () => {
      const { SENSITIVE_PATTERNS } = require('../scripts/security-check.js')
      
      const privateKeyContent = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQlUaKyUcGXYBg
-----END PRIVATE KEY-----`
      
      const hasPrivateKey = SENSITIVE_PATTERNS.some(pattern => 
        pattern.test(privateKeyContent)
      )
      
      expect(hasPrivateKey).toBe(true)
    })
    
    it('should detect Firebase API keys', () => {
      const { SENSITIVE_PATTERNS } = require('../scripts/security-check.js')
      
      const apiKeyContent = 'VITE_FIREBASE_API_KEY=AIzaSyD-j7hx_KPdJrB9idFXRQbO_cpS4MVnw_s'
      
      const hasApiKey = SENSITIVE_PATTERNS.some(pattern => 
        pattern.test(apiKeyContent)
      )
      
      expect(hasApiKey).toBe(true)
    })
    
    it('should detect service account emails', () => {
      const { SENSITIVE_PATTERNS } = require('../scripts/security-check.js')
      
      const serviceAccountContent = 'firebase-adminsdk-fbsvc@financeiro-ctr.iam.gserviceaccount.com'
      
      const hasServiceAccount = SENSITIVE_PATTERNS.some(pattern => 
        pattern.test(serviceAccountContent)
      )
      
      expect(hasServiceAccount).toBe(true)
    })
  })
  
  describe('Environment Variables Security', () => {
    it('should have .env in .gitignore', () => {
      const gitignorePath = path.join(__dirname, '..', '.gitignore')
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
      
      expect(gitignoreContent).toContain('.env')
      expect(gitignoreContent).toContain('*firebase-adminsdk*.json')
    })
    
    it('should have .env.example with safe template', () => {
      const envExamplePath = path.join(__dirname, '..', '.env.example')
      const envExampleContent = fs.readFileSync(envExamplePath, 'utf8')
      
      expect(envExampleContent).toContain('your_api_key_here')
      expect(envExampleContent).toContain('your_project_id')
      expect(envExampleContent).not.toContain('AIzaSy') // Real API key pattern
    })
  })
  
  describe('Gitignore Security Rules', () => {
    it('should block sensitive file patterns', () => {
      const gitignorePath = path.join(__dirname, '..', '.gitignore')
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
      
      const requiredPatterns = [
        '*firebase-adminsdk*.json',
        '*service-account*.json',
        '.env',
        '*.pem',
        '*.key'
      ]
      
      requiredPatterns.forEach(pattern => {
        expect(gitignoreContent).toContain(pattern)
      })
    })
  })
  
  describe('Pre-commit Hook', () => {
    it('should have security check script', () => {
      const securityScriptPath = path.join(__dirname, '..', 'scripts', 'security-check.js')
      expect(fs.existsSync(securityScriptPath)).toBe(true)
      
      const scriptContent = fs.readFileSync(securityScriptPath, 'utf8')
      expect(scriptContent).toContain('SENSITIVE_PATTERNS')
      expect(scriptContent).toContain('BLOCKED_FILES')
    })
    
    it('should have pre-commit hook', () => {
      const preCommitHookPath = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit')
      const preCommitBatPath = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit.bat')
      
      // Check if at least one version exists
      const hookExists = fs.existsSync(preCommitHookPath) || fs.existsSync(preCommitBatPath)
      expect(hookExists).toBe(true)
    })
  })
})