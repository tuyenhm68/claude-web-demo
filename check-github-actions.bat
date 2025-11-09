@echo off
REM ========================================
REM Script kiểm tra GitHub Actions status
REM ========================================

echo.
echo ====================================
echo   Kiem Tra GitHub Actions Status
echo ====================================
echo.

REM Mở trình duyệt tới trang Settings
echo [1] Mo trang Settings cua GitHub Actions...
echo.
start https://github.com/tuyenhm68/claude-web-demo/settings/actions
timeout /t 2 /nobreak >NUL

echo.
echo [2] Mo tab Actions de xem workflows...
echo.
start https://github.com/tuyenhm68/claude-web-demo/actions
timeout /t 2 /nobreak >NUL

echo.
echo [3] Mo tab Pull Requests...
echo.
start https://github.com/tuyenhm68/claude-web-demo/pulls

echo.
echo ====================================
echo   DA MO CAC TAB TRONG TRINH DUYET!
echo ====================================
echo.
echo Vui long kiem tra:
echo.
echo 1. Tab Settings - Actions:
echo    - Da bat "Read and write permissions"?
echo    - Da tick "Allow GitHub Actions to create and approve pull requests"?
echo    - Da click Save?
echo.
echo 2. Tab Actions:
echo    - Co thay workflows khong?
echo    - Workflows co mau xanh (thanh cong) hay do (loi)?
echo.
echo 3. Tab Pull Requests:
echo    - Co PR nao tu dong duoc tao khong?
echo.
pause
