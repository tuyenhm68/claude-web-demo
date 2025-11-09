@echo off
REM ========================================
REM BƯỚC 1: Lấy cookies từ Chrome Profile
REM ========================================

echo.
echo ====================================
echo   BUOC 1: LAY COOKIES TU CHROME
echo ====================================
echo.

REM Kiểm tra Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js chua duoc cai dat!
    pause
    exit /b 1
)

REM Kiểm tra dependencies
if not exist "node_modules\" (
    echo [INFO] Dang cai dat dependencies...
    call npm install
)

echo [INFO] Dang dong Chrome (neu dang chay)...
taskkill /F /IM chrome.exe /T >NUL 2>&1
timeout /t 2 /nobreak >NUL

echo.
echo ========================================
echo  LUU Y QUAN TRONG:
echo ========================================
echo.
echo 1. Chrome se mo voi Profile 14
echo 2. Dam bao da DANG NHAP vao Sora
echo 3. Script se lay cookies va luu vao cookies.json
echo 4. File cookies.json chua thong tin NHAY CAM
echo    - KHONG chia se voi nguoi khac
echo    - KHONG commit vao Git
echo.
pause

echo.
echo [INFO] Dang chay script lay cookies...
echo.

node extract-cookies.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   THANH CONG!
    echo ====================================
    echo.
    echo Da luu cookies vao: cookies.json
    echo.
    echo BUOC TIEP THEO:
    echo - Chay: 2-run-with-cookies.bat
    echo.
) else (
    echo.
    echo [ERROR] Lay cookies that bai!
    echo.
    echo GIAI PHAP:
    echo 1. Dam bao Chrome Profile 14 da dang nhap Sora
    echo 2. Dong tat ca Chrome: kill-chrome.bat
    echo 3. Thu lai script nay
    echo.
)

pause
