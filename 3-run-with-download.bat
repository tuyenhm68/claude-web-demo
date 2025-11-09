@echo off
REM ========================================
REM BƯỚC 3: Chạy automation và tự động tải video
REM ========================================

echo.
echo ====================================
echo   BUOC 3: CHAY VA TAI VIDEO
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
echo.
echo ========================================
echo  LUU Y:
echo ========================================
echo - Script se tu dong tao video
echo - Doi khoang 5 phut de video render
echo - Tu dong download video
echo - File se luu vao thu muc da cau hinh
echo.
pause

echo.
echo [INFO] Dang chay script...
echo.

node sora-with-download.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   THANH CONG!
    echo ====================================
    echo.
    echo Video da duoc tai ve!
    echo Kiem tra thu muc download da cau hinh.
    echo.
) else (
    echo.
    echo [ERROR] Script that bai!
    echo.
    echo NGUYEN NHAN CO THE:
    echo 1. Cookies da het han
    echo 2. Khong tim thay nut download
    echo 3. Giao dien Sora da thay doi
    echo.
    echo GIAI PHAP:
    echo 1. Chay lai: 1-extract-cookies.bat
    echo 2. Tai thu cong trong Chrome
    echo.
)

pause
