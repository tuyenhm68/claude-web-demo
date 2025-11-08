@echo off
REM ========================================
REM Script chạy Puppeteer với Chrome Profile
REM ========================================

echo.
echo ====================================
echo   Chay Puppeteer Script voi Chrome Profile
echo ====================================
echo.

REM Kiểm tra Node.js đã được cài đặt chưa
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js chua duoc cai dat!
    echo Vui long cai dat Node.js tai: https://nodejs.org/
    pause
    exit /b 1
)

REM Kiểm tra npm đã được cài đặt chưa
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm chua duoc cai dat!
    pause
    exit /b 1
)

REM Kiểm tra package.json và cài đặt dependencies nếu cần
if not exist "node_modules\" (
    echo.
    echo [INFO] Dang cai dat cac dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Cai dat dependencies that bai!
        pause
        exit /b 1
    )
)

REM Chạy script Puppeteer
echo.
echo [INFO] Dang chay script...
echo.
node sora-with-profile.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Script chay that bai!
    pause
    exit /b 1
) else (
    echo.
    echo [SUCCESS] Script da chay thanh cong!
)

echo.
pause
