# Sora Puppeteer Automation

Automation script để tạo video trên Sora ChatGPT sử dụng Puppeteer với cookies authentication.

## 📋 Yêu Cầu

- **Node.js** (v18+)
- **Chrome** custom build tại: `E:\temp\VEO_3_create-16-10\creatve_viodeo\browser133\chrome.exe`
- **Chrome Profile 1** tại: `E:\temp\VEO_3_create-16-10\creatve_viodeo\profile\Profile 1`

## 🚀 Cài Đặt

```bash
npm install
```

## 📖 Cách Sử Dụng

### Bước 1: Lấy Cookies (Chỉ làm 1 lần)

```cmd
1-extract-cookies.bat
```

**Quy trình:**
1. Chrome sẽ mở với Profile 1
2. Trang Sora sẽ tự động mở
3. **ĐĂNG NHẬP** vào Sora trong Chrome
4. Sau khi đăng nhập xong, quay lại console
5. Nhấn **ENTER** để lưu cookies
6. Chrome sẽ tự động đóng
7. Cookies được lưu vào `cookies.json`

⚠️ **LƯU Ý:** ĐỪNG đóng Chrome thủ công!

---

### Bước 2: Chạy Automation

```cmd
2-run-with-cookies.bat
```

Script sẽ:
1. Đọc cookies từ `cookies.json`
2. Mở Chrome mới
3. Load cookies vào browser
4. Tự động tạo video trên Sora
5. Đóng Chrome khi hoàn tất

---

## 📁 Cấu Trúc

```
├── 1-extract-cookies.bat       # Lấy cookies từ Chrome Profile
├── 2-run-with-cookies.bat      # Chạy automation với cookies
├── extract-cookies.js          # Script lấy cookies
├── sora-with-cookies.js        # Script automation chính
├── kill-chrome.bat             # Tiện ích đóng Chrome (nếu cần)
├── package.json                # Dependencies
├── .gitignore                  # Bảo vệ cookies.json
├── CONFIG.md                   # Thông tin cấu hình paths
└── COOKIES-GUIDE.md            # Hướng dẫn chi tiết
```

---

## ⚙️ Cấu Hình

Nếu cần thay đổi Chrome path hoặc profile, sửa trong:
- `extract-cookies.js` (lines 18-19)
- `sora-with-cookies.js` (nếu có)

Xem chi tiết trong [CONFIG.md](CONFIG.md)

---

## 🔐 Bảo Mật

- File `cookies.json` chứa thông tin đăng nhập
- **KHÔNG** chia sẻ hoặc commit file này
- File đã được thêm vào `.gitignore`

---

## ❗ Xử Lý Lỗi

### Lỗi: "Failed to launch the browser process"

**Giải pháp:**
```cmd
kill-chrome.bat
```
Chọn **Y** để đóng tất cả Chrome, sau đó thử lại.

### Lỗi: "Không tìm thấy cookies.json"

**Giải pháp:**
```cmd
1-extract-cookies.bat
```
Chạy lại bước 1 để lấy cookies mới.

### Cookies hết hạn

**Giải pháp:**
Chạy lại `1-extract-cookies.bat` để cập nhật cookies (thường sau 5-7 ngày).

---

## 📚 Tài Liệu

- **[COOKIES-GUIDE.md](COOKIES-GUIDE.md)** - Hướng dẫn chi tiết về cookies
- **[CONFIG.md](CONFIG.md)** - Thông tin cấu hình

---

## 🎯 Workflow

```
┌─────────────────────────┐
│ 1. Lấy cookies (1 lần)  │
│ 1-extract-cookies.bat   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. Chạy automation      │
│ 2-run-with-cookies.bat  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ✅ Video được tạo       │
└─────────────────────────┘
```

---

## 📝 License

ISC
