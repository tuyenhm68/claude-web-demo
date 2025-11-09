@echo off
REM ========================================
REM ONE-CLICK SOLUTION - Chay tat ca tu dong
REM ========================================

echo.
echo ====================================
echo   GIAI PHAP 1-CLICK
echo   Tu dong dong Chrome va chay script
echo ====================================
echo.

echo [BUOC 1/4] Dong tat ca Chrome processes...
taskkill /F /IM chrome.exe /T >NUL 2>&1
timeout /t 2 /nobreak >NUL
echo [OK] Da dong Chrome!

echo.
echo [BUOC 2/4] Khoi dong Chrome voi Remote Debugging...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
    --remote-debugging-port=9222 ^
    --user-data-dir="C:\Users\tuyenhm\AppData\Local\Google\Chrome\User Data" ^
    --profile-directory="Profile 14"

echo [OK] Chrome da khoi dong!

echo.
echo [BUOC 3/4] Cho Chrome khoi dong hoan toan...
timeout /t 3 /nobreak >NUL
echo [OK] San sang!

echo.
echo [BUOC 4/4] Chay Puppeteer script...
echo.
node sora-remote-debug.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   THANH CONG!
    echo ====================================
) else (
    echo.
    echo ====================================
    echo   LOI! Xem huong dan duoi day
    echo ====================================
    echo.
    echo Neu van gap loi, hay:
    echo 1. Dong tat ca Chrome thu cong
    echo 2. Chay lai script nay
    echo 3. Hoac xem file FIX-ERRORS.md
)

echo.
pause
