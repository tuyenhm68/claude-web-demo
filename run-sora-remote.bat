@echo off
REM ========================================
REM Chạy Puppeteer với Remote Debugging
REM ========================================

echo.
echo ====================================
echo   Chay Script voi Remote Debugging
echo ====================================
echo.

REM Kiểm tra Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js chua duoc cai dat!
    echo Vui long cai dat Node.js tai: https://nodejs.org/
    pause
    exit /b 1
)

REM Kiểm tra dependencies
if not exist "node_modules\" (
    echo [INFO] Dang cai dat dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Cai dat that bai!
        pause
        exit /b 1
    )
)

REM Kiểm tra Chrome đã mở với debug port chưa
echo [INFO] Kiem tra Chrome debug port...
netstat -an | findstr ":9222" >nul 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] Chrome chua mo voi remote debugging!
    echo.
    choice /C YN /M "Ban co muon khoi dong Chrome debug mode khong?"
    if errorlevel 2 (
        echo.
        echo [INFO] Vui long chay start-chrome-debug.bat truoc!
        pause
        exit /b 0
    )

    echo.
    echo [INFO] Dang khoi dong Chrome debug mode...
    call start-chrome-debug.bat

    echo.
    echo [INFO] Cho 3 giay de Chrome khoi dong...
    timeout /t 3 /nobreak >NUL
)

REM Chạy script
echo.
echo [INFO] Dang chay script...
echo.

node sora-remote-debug.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Script that bai!
    pause
    exit /b 1
) else (
    echo.
    echo [SUCCESS] Hoan tat!
)

echo.
pause
