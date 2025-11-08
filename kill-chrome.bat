@echo off
REM ========================================
REM Script để đóng tất cả Chrome processes
REM ========================================

echo.
echo ====================================
echo   Dong tat ca Chrome processes
echo ====================================
echo.

echo [INFO] Dang kiem tra Chrome processes...
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL

if "%ERRORLEVEL%"=="0" (
    echo [WARNING] Tim thay Chrome dang chay!
    echo.
    choice /C YN /M "Ban co muon dong tat ca Chrome processes khong?"
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
