# ========================================
# Script chạy Puppeteer với Chrome Profile
# PowerShell Version
# ========================================

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Chay Puppeteer Script voi Chrome Profile" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Node.js
try {
    $nodeVersion = node --version
    Write-Host "[INFO] Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js chua duoc cai dat!" -ForegroundColor Red
    Write-Host "Vui long cai dat Node.js tai: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Nhan Enter de thoat"
    exit 1
}

# Kiểm tra npm
try {
    $npmVersion = npm --version
    Write-Host "[INFO] npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm chua duoc cai dat!" -ForegroundColor Red
    Read-Host "Nhan Enter de thoat"
    exit 1
}

# Kiểm tra và cài đặt dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "[INFO] Dang cai dat cac dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Cai dat dependencies that bai!" -ForegroundColor Red
        Read-Host "Nhan Enter de thoat"
        exit 1
    }
}

# Chạy script
Write-Host ""
Write-Host "[INFO] Dang chay script..." -ForegroundColor Yellow
Write-Host ""

node sora-with-profile.js

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Script chay that bai!" -ForegroundColor Red
    Read-Host "Nhan Enter de thoat"
    exit 1
} else {
    Write-Host ""
    Write-Host "[SUCCESS] Script da chay thanh cong!" -ForegroundColor Green
}

Write-Host ""
Read-Host "Nhan Enter de thoat"
