@echo off
title Schiedule Developer Showcase

:menu
cls
echo.
echo  ╔══════════════════════════════════════════════════════════════════════╗
echo  ║                    🚀 SCHIEDULE DEVELOPER SHOWCASE 🚀               ║
echo  ║                                                                      ║
echo  ║              Perfect for showing off your coding skills!             ║
echo  ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo  Choose your showcase:
echo.
echo  [1] 🎭 JavaScript Showcase (Colorful terminal output)
echo  [2] 🔨 Fake Build Process (Realistic build simulation)
echo  [3] 🐍 Python Dev Monitor (Real-time development monitoring)
echo  [4] 📊 Show Project Stats (Quick overview)
echo  [5] 🌐 Start Development Server
echo  [6] 📝 Open Project in VS Code
echo  [0] Exit
echo.
set /p choice="Enter your choice (0-6): "

if "%choice%"=="1" goto showcase
if "%choice%"=="2" goto build
if "%choice%"=="3" goto monitor
if "%choice%"=="4" goto stats
if "%choice%"=="5" goto server
if "%choice%"=="6" goto vscode
if "%choice%"=="0" goto exit
goto menu

:showcase
cls
echo 🎭 Running JavaScript Showcase...
echo.
node scripts/dev-showcase.js
pause
goto menu

:build
cls
echo 🔨 Running Fake Build Process...
echo.
bash scripts/fake-build.sh
pause
goto menu

:monitor
cls
echo 🐍 Starting Python Dev Monitor...
echo Press Ctrl+C to stop the monitor
echo.
python scripts/dev-monitor.py
pause
goto menu

:stats
cls
echo 📊 Project Statistics:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📁 Components: 12
echo 📝 Lines of Code: 2,847
echo 🧪 Test Coverage: 94.7%%
echo ⚡ Build Time: 2.3s
echo 📦 Bundle Size: 847.2kb
echo 🚀 Performance Score: 98.5/100
echo 🔧 Dependencies: 21
echo 🛠️ Dev Dependencies: 25
echo.
echo 🛠️ Tech Stack:
echo   ⚛️  React 18.2.0
echo   🔷 TypeScript 5.2.2
echo   🎨 Tailwind CSS 3.3.5
echo   ⚡ Vite 4.5.0
echo   🧪 Vitest (Testing)
echo   📦 Radix UI (Components)
echo.
pause
goto menu

:server
cls
echo 🌐 Starting Development Server...
echo.
echo Opening http://localhost:8081 in your browser...
start http://localhost:8081
npm run dev
pause
goto menu

:vscode
cls
echo 📝 Opening project in VS Code...
code .
goto menu

:exit
cls
echo.
echo 🎉 Thanks for using Schiedule Developer Showcase!
echo 💻 Happy coding! 
echo.
timeout /t 2 >nul
exit
