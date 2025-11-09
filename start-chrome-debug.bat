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

REM Kiểm tra Chrome đang chạy
echo [INFO] Kiem tra Chrome processes...
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL

if "%ERRORLEVEL%"=="0" (
    echo [WARNING] Chrome dang chay!
    echo.
    echo LUU Y:
    echo - Neu Chrome DA MO voi debug port 9222: Script se ket noi duoc
    echo - Neu Chrome CHUA MO voi debug port: Co the gap loi
    echo.
    echo Neu gap loi, hay:
    echo 1. Dong TAT CA Chrome thu cong
    echo 2. Chay lai script nay
    echo.
    pause
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
