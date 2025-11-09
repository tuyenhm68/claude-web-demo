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

echo.
echo ========================================
echo  QUY TRINH LAY COOKIES:
echo ========================================
echo.
echo 1. Chrome se mo voi Profile 1
echo 2. Trang Sora se tu dong mo
echo 3. Ban hay DANG NHAP vao Sora trong Chrome
echo 4. Sau khi dang nhap xong, quay lai console
echo 5. Nhan ENTER de luu cookies
echo 6. Chrome se tu dong dong
echo.
echo LUU Y:
echo - DUNG DONG Chrome thu cong!
echo - Neu gap loi, dong TAT CA Chrome va chay lai
echo - File cookies.json la NHAY CAM (khong chia se)
echo.
pause

echo.
echo [INFO] Dang chay script...
echo [INFO] Lam theo huong dan tren console...
echo.

node extract-cookies.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   THANH CONG!
    echo ====================================
    echo.
    echo Cookies da duoc luu vao: cookies.json
    echo.
    echo BUOC TIEP THEO:
    echo - Chay: 2-run-with-cookies.bat
    echo - Hoac: node sora-with-cookies.js
    echo.
) else (
    echo.
    echo [ERROR] Quy trinh that bai!
    echo.
    echo GIAI PHAP:
    echo 1. Kiem tra console de xem loi cu the
    echo 2. Neu gap loi "Failed to launch":
    echo    - Dong TAT CA Chrome thu cong
    echo    - Hoac chay: kill-chrome.bat
    echo    - Thu lai script nay
    echo 3. Neu da co cookies.json, co the chay:
    echo    - 2-run-with-cookies.bat
    echo.
)

pause
