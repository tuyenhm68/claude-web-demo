# ========================================
# Script tự động merge vào Main Branch
# PowerShell Version
# ========================================

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Tu dong Merge vao Main Branch" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Lấy tên branch hiện tại
$currentBranch = git rev-parse --abbrev-ref HEAD

Write-Host "[INFO] Branch hien tai: $currentBranch" -ForegroundColor Green

# Kiểm tra xem có phải claude branch không
if (-not $currentBranch.StartsWith("claude/")) {
    Write-Host "[ERROR] Ban phai o tren mot branch bat dau voi 'claude/'" -ForegroundColor Red
    Read-Host "Nhan Enter de thoat"
    exit 1
}

# Push code lên remote
Write-Host ""
Write-Host "[INFO] Dang push code len remote..." -ForegroundColor Yellow
git push -u origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Push that bai!" -ForegroundColor Red
    Read-Host "Nhan Enter de thoat"
    exit 1
}

Write-Host "[SUCCESS] Da push code!" -ForegroundColor Green

# Kiểm tra gh CLI
try {
    $ghVersion = gh --version
    Write-Host "[INFO] GitHub CLI version: $($ghVersion.Split([Environment]::NewLine)[0])" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "[WARNING] GitHub CLI (gh) chua duoc cai dat!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ban co 2 lua chon:" -ForegroundColor Cyan
    Write-Host "1. Cai dat GitHub CLI: https://cli.github.com/" -ForegroundColor White
    Write-Host "2. Tao Pull Request thu cong tren GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "Link tao PR:" -ForegroundColor Cyan
    Write-Host "https://github.com/tuyenhm68/claude-web-demo/compare/main...$currentBranch" -ForegroundColor White
    Write-Host ""
    Read-Host "Nhan Enter de thoat"
    exit 0
}

# Tạo Pull Request
Write-Host ""
Write-Host "[INFO] Dang tao Pull Request..." -ForegroundColor Yellow

$prBody = @"
## Tu dong merge code tu Claude branch

Branch: ``$currentBranch``

### Cac thay doi:
- Xem chi tiet trong cac commits

---
*Pull Request nay duoc tao tu dong boi script merge-to-main.ps1*
"@

$prResult = gh pr create --base main --head $currentBranch --title "Auto-merge: $currentBranch" --body $prBody 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Da tao Pull Request thanh cong!" -ForegroundColor Green
    Write-Host $prResult -ForegroundColor White
    Write-Host ""
    Write-Host "[INFO] Dang merge Pull Request..." -ForegroundColor Yellow

    # Merge PR tự động
    gh pr merge --merge --auto 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] PR da duoc merge tu dong!" -ForegroundColor Green
    } else {
        Write-Host "[INFO] PR can duoc approve hoac doi checks. Vui long kiem tra tren GitHub" -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] PR co the da ton tai. Dang thu merge..." -ForegroundColor Yellow

    # Thử merge PR hiện có
    gh pr merge $currentBranch --merge --auto 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] PR da duoc merge!" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Vui long kiem tra tren GitHub" -ForegroundColor Yellow
        Write-Host "https://github.com/tuyenhm68/claude-web-demo/pulls" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  HOAN TAT!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Nhan Enter de thoat"
