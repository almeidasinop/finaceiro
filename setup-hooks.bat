:: Setup script for Git hooks on Windows
@echo off
echo Setting up Git pre-commit hook...

:: Copy the pre-commit hook to the correct location
if not exist .git\hooks mkdir .git\hooks
copy scripts\pre-commit.bat .git\hooks\pre-commit.bat > nul

:: Create the shell script version for compatibility
copy .git\hooks\pre-commit.bat .git\hooks\pre-commit > nul

echo ✅ Pre-commit hook installed successfully!
echo The hook will run security checks before each commit.
pause