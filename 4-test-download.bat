@echo off
REM ========================================
REM TEST DOWNLOAD - Thử nghiệm tải video
REM ========================================

echo.
echo ====================================
echo   TEST DOWNLOAD VIDEO
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
echo  YEU CAU:
echo ========================================
echo - Da co video tren Sora Drafts
echo   (https://sora.chatgpt.com/drafts)
echo - Cookies con han
echo.
echo ========================================
echo  CHU Y:
echo ========================================
echo - Script su dung selector chinh xac
echo   tu kich ban Puppeteer goc
echo - Tu dong click video ^> ... ^> Download
echo - Timeout mac dinh: 5 giay
echo - Kiem tra thu muc download sau khi
echo   chay xong
echo.
pause

echo.
echo [INFO] Dang chay test download...
echo.

node test-download.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   TEST HOAN TAT!
    echo ====================================
    echo.
    echo Kiem tra thu muc download de xem ket qua.
    echo.
) else (
    echo.
    echo [ERROR] Test that bai!
    echo.
    echo NGUYEN NHAN CO THE:
    echo 1. Khong co video tren Sora Drafts
    echo 2. Cookies da het han
    echo 3. Selector thay doi (UI cap nhat)
    echo.
    echo GIAI PHAP:
    echo 1. Mo https://sora.chatgpt.com/drafts
    echo    va dam bao co video
    echo 2. Chay lai: 1-extract-cookies.bat
    echo 3. Kiem tra Chrome de xem loi
    echo.
)

pause
