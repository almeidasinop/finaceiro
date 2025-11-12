@echo off
REM Pre-commit hook for security checks on Windows

echo 🔍 Running security checks...

REM Run the security check script
node scripts/security-check.js

REM Check the exit code
if %errorlevel% neq 0 (
    echo ❌ Security check failed! Commit aborted.
    exit /b 1
)

echo ✅ Security check passed!
exit /b 0