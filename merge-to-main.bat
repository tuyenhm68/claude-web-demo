@echo off
REM ========================================
REM Script tự động tạo Pull Request merge vào main
REM ========================================

echo.
echo ====================================
echo   Tu dong Merge vao Main Branch
echo ====================================
echo.

REM Lấy tên branch hiện tại
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%a

echo [INFO] Branch hien tai: %CURRENT_BRANCH%

REM Kiểm tra xem có phải claude branch không
echo %CURRENT_BRANCH% | findstr /C:"claude/" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ban phai o tren mot branch bat dau voi 'claude/'
    pause
    exit /b 1
)

REM Push code lên remote
echo.
echo [INFO] Dang push code len remote...
git push -u origin %CURRENT_BRANCH%
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Push that bai!
    pause
    exit /b 1
)

REM Kiểm tra gh CLI
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] GitHub CLI (gh) chua duoc cai dat!
    echo.
    echo Ban co 2 lua chon:
    echo 1. Cai dat GitHub CLI: https://cli.github.com/
    echo 2. Tao Pull Request thu cong tren GitHub
    echo.
    echo Link tao PR:
    echo https://github.com/tuyenhm68/claude-web-demo/compare/main...%CURRENT_BRANCH%
    echo.
    pause
    exit /b 0
)

REM Tạo Pull Request
echo.
echo [INFO] Dang tao Pull Request...
gh pr create --base main --head %CURRENT_BRANCH% --title "Auto-merge: %CURRENT_BRANCH%" --body "$(cat <<'EOF'
## Tu dong merge code tu Claude branch

Branch: `%CURRENT_BRANCH%`

### Cac thay doi:
- Xem chi tiet trong cac commits

---
*Pull Request nay duoc tao tu dong boi script merge-to-main.bat*
EOF
)" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Da tao Pull Request thanh cong!
    echo.
    echo [INFO] Dang merge Pull Request...

    REM Merge PR tự động
    gh pr merge --merge --auto

    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] PR da duoc merge tu dong!
    ) else (
        echo [INFO] Vui long merge thu cong tren GitHub
    )
) else (
    echo [INFO] PR co the da ton tai. Dang thu merge...

    REM Thử merge PR hiện có
    gh pr merge %CURRENT_BRANCH% --merge --auto 2>nul

    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] PR da duoc merge!
    ) else (
        echo [INFO] Vui long kiem tra tren GitHub
        echo https://github.com/tuyenhm68/claude-web-demo/pulls
    )
)

echo.
echo ====================================
echo   HOAN TAT!
echo ====================================
echo.
pause
