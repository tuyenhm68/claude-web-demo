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

#### Option A: Tạo Video (Không Tải Về)

```cmd
2-run-with-cookies.bat
```

Script sẽ:
1. Đọc cookies từ `cookies.json`
2. Mở Chrome mới
3. Load cookies vào browser
4. Tự động tạo video trên Sora
5. Đóng Chrome khi hoàn tất

#### Option B: Tạo Video + Tự Động Tải Về

```cmd
3-run-with-download.bat
```

Script sẽ:
1. Đọc cookies từ `cookies.json`
2. Mở Chrome mới
3. Load cookies vào browser
4. Tự động tạo video trên Sora
5. Đợi 5 phút để video render
6. **Tự động tải video về thư mục chỉ định**

⚙️ **Cấu hình thư mục download:** Sửa dòng 16 trong `sora-with-download.js`

#### Option C: Test Download (Không Tạo Video Mới)

```cmd
4-test-download.bat
```

Script sẽ:
1. Sử dụng video đã có trên Sora
2. Thử nghiệm chức năng download
3. Kiểm tra selector và download path

💡 **Dùng khi:** Muốn test download mà không tạo video mới

---

## 📁 Cấu Trúc

```
├── 1-extract-cookies.bat       # Lấy cookies từ Chrome Profile
├── 2-run-with-cookies.bat      # Chạy automation với cookies (tạo video)
├── 3-run-with-download.bat     # Chạy automation + tự động download
├── 4-test-download.bat         # Test download với video có sẵn
├── extract-cookies.js          # Script lấy cookies
├── sora-with-cookies.js        # Script automation chính
├── sora-with-download.js       # Script với chức năng tự động download
├── test-download.js            # Script test download
├── kill-chrome.bat             # Tiện ích đóng Chrome (nếu cần)
├── package.json                # Dependencies
├── .gitignore                  # Bảo vệ cookies.json
├── CONFIG.md                   # Thông tin cấu hình paths
├── COOKIES-GUIDE.md            # Hướng dẫn chi tiết cookies
└── DOWNLOAD-GUIDE.md           # Hướng dẫn chi tiết download
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
- **[DOWNLOAD-GUIDE.md](DOWNLOAD-GUIDE.md)** - Hướng dẫn chi tiết về download
- **[CONFIG.md](CONFIG.md)** - Thông tin cấu hình

---

## 🎯 Workflow

### Workflow Chính: Tạo Video + Download

```
┌─────────────────────────┐
│ 1. Lấy cookies (1 lần)  │
│ 1-extract-cookies.bat   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2A. Chỉ tạo video       │
│ 2-run-with-cookies.bat  │
│         OR              │
│ 2B. Tạo + Download      │
│ 3-run-with-download.bat │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ✅ Video được tạo       │
│ (và download nếu 2B)    │
└─────────────────────────┘
```

### Workflow Test: Chỉ Test Download

```
┌─────────────────────────┐
│ 1. Đảm bảo có video     │
│ trên Sora profile       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. Chạy test download   │
│ 4-test-download.bat     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ✅ Kiểm tra thư mục     │
│ download                │
└─────────────────────────┘
```

---

## 📝 License

ISC
