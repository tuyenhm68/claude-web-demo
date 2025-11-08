# Hướng Dẫn Sửa Lỗi "Failed to launch the browser process"

## 🔴 Lỗi Gặp Phải

```
Error: Failed to launch the browser process! undefined
```

Lỗi này xảy ra khi Puppeteer không thể khởi chạy Chrome với profile đã chỉ định.

## ✅ CÁC PHƯƠNG ÁN GIẢI QUYẾT

Tôi đã tạo cho bạn **3 PHƯƠNG ÁN** khác nhau để chạy script. Hãy thử theo thứ tự sau:

---

## 📌 PHƯƠNG ÁN 1: Đóng Chrome và Thử Lại (KHUYẾN NGHỊ THỬ ĐẦU TIÊN)

### Nguyên nhân
Chrome đang mở và đang sử dụng Profile 14, khiến Puppeteer không thể truy cập profile.

### Cách khắc phục

#### Bước 1: Đóng tất cả Chrome
**Cách A - Dùng script tự động:**
```cmd
kill-chrome.bat
```

**Cách B - Thủ công:**
1. Đóng tất cả cửa sổ Chrome
2. Mở Task Manager (Ctrl + Shift + Esc)
3. Tìm tất cả process "Google Chrome"
4. Click phải → End Task

#### Bước 2: Chờ vài giây
Đợi 2-3 giây để Chrome đóng hoàn toàn

#### Bước 3: Chạy lại script
```cmd
run-sora-script.bat
```

### Script đã được cải thiện
File `sora-with-profile.js` đã được cập nhật với:
- Thêm các arguments để tránh conflict
- Disable các features không cần thiết
- Tăng tính ổn định

---

## 📌 PHƯƠNG ÁN 2: Remote Debugging (KHUYẾN NGHỊ NHẤT - ỔN ĐỊNH NHẤT)

### Ưu điểm
✓ Không lo profile bị lock
✓ Sử dụng Chrome profile thật với tất cả sessions đã đăng nhập
✓ Ổn định và đáng tin cậy nhất

### Cách sử dụng

#### Bước 1: Khởi động Chrome với Debug Mode
**Cách A - Dùng script tự động:**
```cmd
start-chrome-debug.bat
```

Script sẽ:
- Tự động đóng Chrome (nếu đang chạy)
- Khởi động lại Chrome với remote debugging port 9222
- Sử dụng Profile 14 của bạn

**Cách B - Thủ công:**
1. Đóng tất cả Chrome
2. Mở Command Prompt
3. Chạy lệnh:
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
    --remote-debugging-port=9222 ^
    --user-data-dir="C:\Users\tuyenhm\AppData\Local\Google\Chrome\User Data" ^
    --profile-directory="Profile 14"
```

#### Bước 2: Chạy script
**Cách A - Dùng batch file:**
```cmd
run-sora-remote.bat
```

**Cách B - Dùng Node trực tiếp:**
```cmd
node sora-remote-debug.js
```

### Lưu ý
- Chrome sẽ vẫn mở sau khi script chạy xong
- Bạn có thể xem kết quả video được tạo
- Đóng Chrome bằng tay khi hoàn tất

---

## 📌 PHƯƠNG ÁN 3: Không Dùng Profile (DỰ PHÒNG)

### Khi nào dùng
- Phương án 1 và 2 đều thất bại
- Bạn không cần thiết phải dùng profile cụ thể

### Nhược điểm
⚠️ Cần đăng nhập thủ công mỗi lần chạy
⚠️ Không có sessions/cookies đã lưu

### Cách sử dụng

```cmd
node sora-without-profile.js
```

### Quy trình
1. Script sẽ mở Chrome mới (không có profile)
2. Đi tới trang Sora
3. **QUAN TRỌNG:** Bạn cần đăng nhập thủ công
4. Sau khi đăng nhập xong, script sẽ tự động tiếp tục

---

## 🛠️ TÓM TẮT CÁC FILE

| File | Mô tả | Khi nào dùng |
|------|-------|--------------|
| `sora-with-profile.js` | Script chính với profile | Sau khi đã đóng Chrome |
| `sora-remote-debug.js` | Script với remote debugging | **KHUYẾN NGHỊ** - Ổn định nhất |
| `sora-without-profile.js` | Script không dùng profile | Khi cả 2 cách trên thất bại |
| `run-sora-script.bat` | Chạy script chính | Phương án 1 |
| `run-sora-remote.bat` | Chạy với remote debugging | **Phương án 2 - TỐT NHẤT** |
| `start-chrome-debug.bat` | Khởi động Chrome debug mode | Dùng cho phương án 2 |
| `kill-chrome.bat` | Đóng tất cả Chrome | Dùng trước phương án 1 |

---

## 📋 HƯỚNG DẪN NHANH

### Lần đầu tiên chạy

```cmd
# 1. Cài đặt dependencies (chỉ cần làm 1 lần)
npm install

# 2. Chọn 1 trong 2 cách:

# CÁCH 1: Remote Debugging (Khuyến nghị)
start-chrome-debug.bat
run-sora-remote.bat

# CÁCH 2: Đóng Chrome và chạy trực tiếp
kill-chrome.bat
run-sora-script.bat
```

### Các lần sau

**Nếu dùng Remote Debugging:**
```cmd
# Nếu Chrome chưa mở hoặc không có debug mode:
start-chrome-debug.bat

# Chạy script:
run-sora-remote.bat
```

**Nếu dùng cách thông thường:**
```cmd
# Đóng Chrome:
kill-chrome.bat

# Chạy script:
run-sora-script.bat
```

---

## ❓ XỬ LÝ CÁC LỖI KHÁC

### Lỗi: "Node.js chưa được cài đặt"
**Giải pháp:**
1. Tải Node.js: https://nodejs.org/ (chọn bản LTS)
2. Cài đặt Node.js
3. Khởi động lại Command Prompt
4. Kiểm tra: `node --version`

### Lỗi: "npm install thất bại"
**Giải pháp:**
```cmd
# Xóa node_modules và thử lại
rmdir /s /q node_modules
npm cache clean --force
npm install
```

### Lỗi: "Cannot find module 'puppeteer'"
**Giải pháp:**
```cmd
npm install puppeteer
```

### Lỗi: "Port 9222 already in use" (khi dùng remote debugging)
**Giải pháp:**
```cmd
# Đóng Chrome và thử lại
kill-chrome.bat
start-chrome-debug.bat
```

### Lỗi: "Timeout exceeded"
**Giải pháp:**
1. Kiểm tra kết nối internet
2. Tăng timeout trong script (tìm `const timeout = 5000;` và đổi thành `10000` hoặc `30000`)
3. Đảm bảo trang Sora đang hoạt động bình thường

### Lỗi: "Element not found" hoặc "Locator failed"
**Nguyên nhân:** Giao diện Sora có thể đã thay đổi

**Giải pháp:**
1. Mở trang Sora thủ công
2. Kiểm tra xem các element (textarea, nút Create video) có tồn tại không
3. Có thể cần cập nhật selectors trong script

---

## 💡 MẸO VÀ GỢI Ý

### 1. Giữ Chrome mở để xem kết quả
Trong file script, comment dòng `await browser.close();`:
```javascript
// await browser.close();  // Comment dòng này để giữ Chrome mở
```

### 2. Chạy ở chế độ headless (ẩn trình duyệt)
Đổi `headless: false` thành `headless: true` trong script

### 3. Tăng thời gian chờ
Tìm dòng `const timeout = 5000;` và tăng giá trị (đơn vị: milliseconds)

### 4. Kiểm tra Chrome profile path
Mở Chrome → Gõ vào thanh địa chỉ:
```
chrome://version
```
Xem dòng "Profile Path" để đảm bảo đường dẫn đúng

---

## 🆘 VẪN GẶP VẤN ĐỀ?

Nếu tất cả các phương án trên đều thất bại, vui lòng:

1. Kiểm tra lại:
   - Node.js version: `node --version` (nên >= 18.0.0)
   - Puppeteer version: `npm list puppeteer`
   - Chrome version: Mở Chrome → Menu → Help → About Google Chrome

2. Thử với Chrome profile khác:
   - Mở file script
   - Đổi `--profile-directory=Profile 14` thành `--profile-directory=Default` hoặc `Profile 1`

3. Kiểm tra quyền:
   - Đảm bảo bạn có quyền đọc/ghi vào thư mục User Data
   - Chạy Command Prompt as Administrator

---

**Chúc bạn thành công! 🎉**
