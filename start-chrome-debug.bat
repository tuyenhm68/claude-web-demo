@echo off
REM ========================================
REM Khởi động Chrome với Remote Debugging
REM Để sử dụng với sora-remote-debug.js
REM ========================================

echo.
echo ====================================
echo   Khoi dong Chrome voi Remote Debugging
echo ====================================
echo.

REM Đóng tất cả Chrome processes trước
echo [INFO] Kiem tra Chrome processes...
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL

if "%ERRORLEVEL%"=="0" (
    echo [WARNING] Chrome dang chay!
    echo [INFO] Can dong Chrome truoc khi khoi dong lai voi debug mode...
    echo.
    choice /C YN /M "Dong tat ca Chrome processes?"
    if errorlevel 2 (
        echo [INFO] Da huy.
        pause
        exit /b 0
    )

    echo [INFO] Dang dong Chrome...
    taskkill /F /IM chrome.exe /T >NUL 2>&1
    timeout /t 2 /nobreak >NUL
)

REM Khởi động Chrome với remote debugging
echo.
echo [INFO] Dang khoi dong Chrome voi Remote Debugging (port 9222)...
echo [INFO] Su dung Profile 1...
echo.

start "" "E:\temp\VEO_3_create-16-10\creatve_viodeo\browser133\chrome.exe" ^
    --remote-debugging-port=9222 ^
    --user-data-dir="E:\temp\VEO_3_create-16-10\creatve_viodeo\profile" ^
    --profile-directory="Profile 1"

echo.
echo [SUCCESS] Chrome da khoi dong!
echo.
echo ========================================
echo HUONG DAN:
echo 1. Chrome da mo voi Profile 1
echo 2. Bay gio chay: node sora-remote-debug.js
echo 3. Hoac chay: run-sora-remote.bat
echo ========================================
echo.
pause
