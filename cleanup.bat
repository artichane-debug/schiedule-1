@echo off
echo 🧹 Cleaning up repository structure...

REM Create docs folder for documentation
if not exist "docs" mkdir docs

REM Move documentation files to docs folder
if exist "IMPROVEMENTS_SUMMARY.md" move "IMPROVEMENTS_SUMMARY.md" "docs\"
if exist "MOBILE_UX_IMPROVEMENTS.md" move "MOBILE_UX_IMPROVEMENTS.md" "docs\"
if exist "TESTING.md" move "TESTING.md" "docs\"
if exist "README-showcase.md" del "README-showcase.md"

REM Create assets folder for images
if not exist "assets" mkdir assets

REM Move image files to assets folder
if exist "65f28f14-181b-48cb-b534-3ef3faa675e4.jpg" move "65f28f14-181b-48cb-b534-3ef3faa675e4.jpg" "assets\"
if exist "WhatsApp Image 2025-09-21 at 11.58.31 AM.jpeg" move "WhatsApp Image 2025-09-21 at 11.58.31 AM.jpeg" "assets\"
if exist "github-logo.jpeg" move "github-logo.jpeg" "assets\"

REM Remove unnecessary files
if exist "gh.exe" del "gh.exe"
if exist "bun.lockb" del "bun.lockb"
if exist "test-app.js" del "test-app.js"
if exist "test-runner.cjs" del "test-runner.cjs"
if exist "showcase.bat" del "showcase.bat"
if exist "organize-files.bat" del "organize-files.bat"

REM Remove demo folder if it exists
if exist "demo" rmdir /s /q "demo"
if exist "tests" rmdir /s /q "tests"

echo ✅ Repository cleanup completed!
echo 📁 Created: docs/ folder for documentation
echo 🖼️ Created: assets/ folder for images  
echo 🗑️ Removed: unnecessary files and folders
pause
