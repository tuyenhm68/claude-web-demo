@echo off
REM ========================================
REM BƯỚC 2: Chạy script với cookies đã lưu
REM ========================================

echo.
echo ====================================
echo   BUOC 2: CHAY SCRIPT VOI COOKIES
echo ====================================
echo.

REM Kiểm tra Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js chua duoc cai dat!
    pause
    exit /b 1
)

REM Kiểm tra file cookies
if not exist "cookies.json" (
    echo [ERROR] Khong tim thay file cookies.json!
    echo.
    echo GIAI PHAP:
    echo 1. Chay truoc: 1-extract-cookies.bat
    echo 2. Dam bao da lay cookies thanh cong
    echo 3. Sau do chay lai script nay
    echo.
    pause
    exit /b 1
)

REM Kiểm tra dependencies
if not exist "node_modules\" (
    echo [INFO] Dang cai dat dependencies...
    call npm install
)

echo [INFO] Tim thay file cookies.json
echo [INFO] Dang chay script...
echo.

node sora-with-cookies.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   THANH CONG!
    echo ====================================
    echo.
) else (
    echo.
    echo [ERROR] Script that bai!
    echo.
    echo NGUYEN NHAN CO THE:
    echo 1. Cookies da het han
    echo 2. Can dang nhap lai
    echo.
    echo GIAI PHAP:
    echo 1. Dang nhap lai vao Sora trong Chrome
    echo 2. Chay lai: 1-extract-cookies.bat
    echo 3. Sau do chay lai script nay
    echo.
)

pause
