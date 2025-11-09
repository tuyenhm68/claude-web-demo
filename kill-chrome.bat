@echo off
REM ========================================
REM Script để đóng tất cả Chrome processes
REM ========================================

echo.
echo ====================================
echo   Dong tat ca Chrome processes
echo ====================================
echo.

echo ========================================
echo  CANH BAO:
echo  Script nay se dong TAT CA Chrome!
echo  Bao gom ca Chrome ban dang su dung!
echo ========================================
echo.

echo [INFO] Dang kiem tra Chrome processes...
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL

if "%ERRORLEVEL%"=="0" (
    echo [WARNING] Tim thay Chrome dang chay!
    echo.
    echo LUU Y:
    echo - TAT CA Chrome se bi dong (ke ca Chrome khac)
    echo - Tat ca tab dang mo se mat
    echo - Luu cong viec truoc khi tiep tuc!
    echo.
    choice /C YN /M "Ban CHAC CHAN muon dong tat ca Chrome?"
    if errorlevel 2 (
        echo [INFO] Da huy.
        pause
        exit /b 0
    )

    echo.
    echo [INFO] Dang dong Chrome...
    taskkill /F /IM chrome.exe /T >NUL 2>&1

    REM Chờ một chút để đảm bảo processes đã đóng hoàn toàn
    timeout /t 2 /nobreak >NUL

    echo [SUCCESS] Da dong tat ca Chrome processes!
) else (
    echo [INFO] Khong co Chrome process nao dang chay.
)

echo.
pause
