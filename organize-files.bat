@echo off
echo 🧹 Organizing Schiedule project files...
echo.

REM Create demo directories
if not exist "demo" mkdir demo
if not exist "demo\ai" mkdir demo\ai
if not exist "demo\blockchain" mkdir demo\blockchain
if not exist "demo\quantum" mkdir demo\quantum
if not exist "demo\scripts" mkdir demo\scripts

echo 📁 Moving showcase files to demo folder...

REM Move AI files
if exist "src\ai" (
    move "src\ai\*" "demo\ai\" >nul 2>&1
    rmdir "src\ai" >nul 2>&1
    echo   ✓ Moved AI files
)

REM Move blockchain files  
if exist "src\blockchain" (
    move "src\blockchain\*" "demo\blockchain\" >nul 2>&1
    rmdir "src\blockchain" >nul 2>&1
    echo   ✓ Moved blockchain files
)

REM Move quantum files
if exist "src\quantum" (
    move "src\quantum\*" "demo\quantum\" >nul 2>&1
    rmdir "src\quantum" >nul 2>&1
    echo   ✓ Moved quantum files
)

REM Move script files
if exist "scripts" (
    move "scripts\*" "demo\scripts\" >nul 2>&1
    rmdir "scripts" >nul 2>&1
    echo   ✓ Moved script files
)

REM Move other showcase files
if exist "test-runner.cjs" (
    move "test-runner.cjs" "demo\" >nul 2>&1
    echo   ✓ Moved test-runner.cjs
)

if exist "quick-test.js" (
    move "quick-test.js" "demo\" >nul 2>&1
    echo   ✓ Moved quick-test.js
)

if exist "showcase.bat" (
    move "showcase.bat" "demo\" >nul 2>&1
    echo   ✓ Moved showcase.bat
)

if exist "package-showcase.json" (
    move "package-showcase.json" "demo\" >nul 2>&1
    echo   ✓ Moved package-showcase.json
)

if exist "README-showcase.md" (
    move "README-showcase.md" "demo\" >nul 2>&1
    echo   ✓ Moved README-showcase.md
)

echo.
echo ✅ Organization complete!
echo.
echo 📋 Your project structure is now clean:
echo   📁 src/           - Real web app code
echo   📁 public/        - Web app assets  
echo   📁 demo/          - Showcase/demo files
echo   📄 package.json   - Real dependencies
echo   📄 vite.config.ts - Real build config
echo.
echo 🎯 The demo folder contains all the "flex" files for screenshots
echo 💻 The main directory only has your actual Schiedule web app
echo.
pause
