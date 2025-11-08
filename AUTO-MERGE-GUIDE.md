# Hướng Dẫn Tự Động Merge Code vào Main Branch

## 🎯 Tổng Quan

Tài liệu này hướng dẫn cách tự động merge code từ branch `claude/*` vào branch `main` khi có thay đổi.

## 🚀 CÁC PHƯƠNG ÁN TỰ ĐỘNG MERGE

### PHƯƠNG ÁN 1: GitHub Actions (KHUYẾN NGHỊ) ⭐

**Ưu điểm:**
✓ Hoàn toàn tự động
✓ Không cần làm gì, chỉ cần push code
✓ Không cần cài đặt công cụ

**Cách hoạt động:**
- Mỗi khi bạn push code lên branch `claude/*`
- GitHub Actions tự động tạo Pull Request
- Tự động merge vào main

**File đã tạo:**
- `.github/workflows/auto-merge-on-push.yml` - Tự động merge khi push
- `.github/workflows/auto-merge.yml` - Tự động approve và merge PR

**Cách kích hoạt:**
```bash
# Chỉ cần push code như bình thường
git push
```

Workflow sẽ tự động:
1. Tạo Pull Request từ branch `claude/*` → `main`
2. Auto-approve PR (nếu cần)
3. Merge PR vào main

**Lưu ý:**
- Cần bật GitHub Actions trong repository settings
- Workflow chỉ chạy khi push lên remote GitHub

---

### PHƯƠNG ÁN 2: Script Local (Thủ công nhưng nhanh)

**Ưu điểm:**
✓ Kiểm soát được quá trình merge
✓ Không cần chờ GitHub Actions
✓ Có thể chạy offline

**Cách sử dụng:**

#### Windows Batch:
```cmd
merge-to-main.bat
```

#### PowerShell:
```powershell
.\merge-to-main.ps1
```

**Script sẽ:**
1. Push code lên remote
2. Tạo Pull Request (nếu chưa có)
3. Auto-merge PR vào main

**Yêu cầu:**
- Cần cài đặt [GitHub CLI (gh)](https://cli.github.com/)
- Đăng nhập: `gh auth login`

---

### PHƯƠNG ÁN 3: Tích Hợp vào Run Scripts

Bạn có thể tích hợp auto-merge vào các script chạy Puppeteer:

#### Sửa file `run-sora-script.bat`:

Thêm vào cuối file (trước `pause`):
```batch
REM Auto-merge vào main
echo.
choice /C YN /M "Ban co muon merge code vao main branch khong?"
if not errorlevel 2 (
    call merge-to-main.bat
)
```

#### Sửa file `run-sora-remote.bat`:

Thêm vào cuối file:
```batch
REM Auto-merge
call merge-to-main.bat
```

---

## 📋 SO SÁNH CÁC PHƯƠNG ÁN

| Tiêu chí | GitHub Actions | Script Local |
|----------|----------------|--------------|
| **Tự động hoàn toàn** | ✅ Có | ❌ Cần chạy script |
| **Cần cài đặt** | ❌ Không | ✅ Cần GitHub CLI |
| **Hoạt động offline** | ❌ Không | ✅ Có (nhưng cần online để push) |
| **Tốc độ** | Chậm hơn (1-2 phút) | Nhanh (vài giây) |
| **Kiểm soát** | Ít | Nhiều |
| **Khuyến nghị** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🛠️ HƯỚNG DẪN CHI TIẾT

### Cài Đặt GitHub Actions

#### Bước 1: Push workflows lên GitHub
```bash
git add .github/workflows/
git commit -m "Add auto-merge GitHub Actions"
git push
```

#### Bước 2: Bật GitHub Actions
1. Mở repository trên GitHub
2. Vào **Settings** → **Actions** → **General**
3. Trong mục **Workflow permissions**, chọn:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

#### Bước 3: Test
```bash
# Thử push một thay đổi nhỏ
git commit --allow-empty -m "Test auto-merge"
git push

# Kiểm tra tab Actions trên GitHub để xem workflow chạy
```

---

### Cài Đặt Script Local

#### Bước 1: Cài GitHub CLI

**Windows:**

**Cách A - Dùng WinGet:**
```cmd
winget install --id GitHub.cli
```

**Cách B - Dùng Chocolatey:**
```cmd
choco install gh
```

**Cách C - Tải trực tiếp:**
Tải từ: https://cli.github.com/

#### Bước 2: Đăng nhập GitHub CLI
```bash
gh auth login
```

Chọn:
1. **GitHub.com**
2. **HTTPS**
3. **Login with a web browser** (dễ nhất)

#### Bước 3: Test script
```cmd
merge-to-main.bat
```

---

## 🎬 QUY TRÌNH LÀM VIỆC

### Với GitHub Actions (Tự động)

```bash
# 1. Làm việc bình thường
git add .
git commit -m "Your changes"
git push

# 2. Xong! GitHub Actions tự động merge vào main
```

### Với Script Local (Bán tự động)

```bash
# 1. Làm việc và commit
git add .
git commit -m "Your changes"

# 2. Chạy script merge
merge-to-main.bat

# 3. Xong! Code đã được merge vào main
```

---

## ⚙️ TÙY CHỈNH

### Thay đổi Auto-merge Behavior

#### File: `.github/workflows/auto-merge-on-push.yml`

**Tắt auto-merge, chỉ tạo PR:**
```yaml
# Comment dòng này:
# - name: Auto-merge PR
#   run: |
#     ...
```

**Chỉ merge khi pass tests:**
Thêm step check tests trước khi merge:
```yaml
- name: Run tests
  run: npm test

- name: Auto-merge PR
  if: success()  # Chỉ merge nếu tests pass
  run: |
    ...
```

**Merge với squash thay vì merge commit:**
```yaml
gh pr merge $PR_NUMBER --squash --auto
```

---

## 🔍 KIỂM TRA VÀ DEBUG

### Xem trạng thái Pull Requests
```bash
gh pr list
```

### Xem chi tiết một PR
```bash
gh pr view <PR_NUMBER>
```

### Merge thủ công một PR
```bash
gh pr merge <PR_NUMBER> --merge
```

### Xem logs GitHub Actions
1. Mở repository trên GitHub
2. Tab **Actions**
3. Click vào workflow run để xem logs

---

## ❗ XỬ LÝ LỖI

### Lỗi: "GitHub Actions workflow not running"

**Nguyên nhân:**
- GitHub Actions chưa được bật
- Workflow file có lỗi syntax

**Giải pháp:**
1. Kiểm tra Settings → Actions → General
2. Bật "Read and write permissions"
3. Kiểm tra syntax YAML: https://www.yamllint.com/

### Lỗi: "gh: command not found"

**Giải pháp:**
```bash
# Cài GitHub CLI
winget install --id GitHub.cli

# Hoặc
choco install gh

# Sau đó đăng nhập
gh auth login
```

### Lỗi: "PR already exists"

**Nguyên nhân:**
PR từ branch này đã tồn tại

**Giải pháp:**
Script sẽ tự động merge PR hiện có. Nếu không thành công:
```bash
# Xem PR hiện có
gh pr list

# Merge thủ công
gh pr merge <PR_NUMBER> --merge
```

### Lỗi: "refusing to merge unrelated histories"

**Giải pháp:**
```bash
git pull origin main --allow-unrelated-histories
git push
```

### Lỗi: "403 Forbidden" khi push

**Nguyên nhân:**
Không có quyền push trực tiếp lên main

**Giải pháp:**
Đúng rồi! Đó là lý do chúng ta dùng Pull Request để merge

---

## 💡 MẸO VÀ GỢI Ý

### 1. Xem workflow đang chạy
```bash
gh run list
gh run view <RUN_ID>
```

### 2. Tắt auto-merge tạm thời
Thêm `[skip ci]` vào commit message:
```bash
git commit -m "WIP: Work in progress [skip ci]"
```

### 3. Merge nhiều commits một lúc
GitHub Actions tự động merge tất cả commits mới

### 4. Xem history merges
```bash
git log --oneline --graph --all
```

### 5. Rollback nếu cần
```bash
# Xem commits trên main
git log origin/main --oneline

# Tạo PR revert
gh pr create --base main --title "Revert changes"
```

---

## 📊 WORKFLOW DIAGRAM

```
┌─────────────────────┐
│  Làm thay đổi code  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   git add & commit  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     git push        │
└──────────┬──────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
┌─────────────────────┐   ┌──────────────────┐
│  GitHub Actions     │   │  Script Local    │
│  (tự động)          │   │  (thủ công)      │
└──────────┬──────────┘   └────────┬─────────┘
           │                       │
           └───────┬───────────────┘
                   ▼
         ┌─────────────────────┐
         │   Tạo Pull Request  │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Auto-merge vào main│
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   ✅ HOÀN THÀNH!    │
         └─────────────────────┘
```

---

## 🎯 KHUYẾN NGHỊ

### Cho người mới:
✓ Dùng **GitHub Actions** (Phương án 1)
✓ Không cần cài đặt gì
✓ Hoàn toàn tự động

### Cho người có kinh nghiệm:
✓ Dùng **Script Local** (Phương án 2)
✓ Kiểm soát tốt hơn
✓ Nhanh hơn

### Cho dự án lớn:
✓ Kết hợp cả 2
✓ GitHub Actions cho CI/CD
✓ Script local cho testing nhanh

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Kiểm tra file `FIX-ERRORS.md`
2. Xem logs GitHub Actions
3. Chạy script với verbose: `gh pr create --help`
4. Kiểm tra permissions trên GitHub

---

**Chúc bạn thành công với việc tự động hóa workflow! 🎉**
