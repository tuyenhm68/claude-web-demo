@echo off
REM ========================================
REM ONE-CLICK SOLUTION - Chay tat ca tu dong
REM ========================================

echo.
echo ====================================
echo   GIAI PHAP 1-CLICK
echo   Remote Debugging - Khong dong Chrome
echo ====================================
echo.

echo ========================================
echo  CAU HINH:
echo  - Profile: Profile 1
echo  - Remote Debug Port: 9222
echo ========================================
echo.
echo LUU Y: Neu gap loi, hay:
echo 1. Dong TAT CA Chrome thu cong
echo 2. Chay lai script nay
echo.

echo [BUOC 1/3] Khoi dong Chrome voi Remote Debugging...
start "" "E:\temp\VEO_3_create-16-10\creatve_viodeo\browser133\chrome.exe" ^
    --remote-debugging-port=9222 ^
    --user-data-dir="E:\temp\VEO_3_create-16-10\creatve_viodeo\profile" ^
    --profile-directory="Profile 1"

echo [OK] Chrome da khoi dong!

echo.
echo [BUOC 2/3] Cho Chrome khoi dong hoan toan...
timeout /t 3 /nobreak >NUL
echo [OK] San sang!

echo.
echo [BUOC 3/3] Chay Puppeteer script...
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
