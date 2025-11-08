# Hướng Dẫn Chạy Script Puppeteer với Chrome Profile

## 📋 Yêu Cầu Hệ Thống

- **Node.js** (phiên bản 18 trở lên): [Tải tại đây](https://nodejs.org/)
- **Google Chrome** đã được cài đặt
- **Chrome Profile** đã đăng nhập sẵn tài khoản

## 📁 Các File Trong Dự Án

- `sora-with-profile.js` - Script Puppeteer đã cấu hình với Chrome profile
- `sora-2.js` - Script gốc (không dùng profile)
- `run-sora-script.bat` - File batch để chạy script nhanh chóng
- `package.json` - File cấu hình Node.js dependencies

## 🚀 Cách Sử Dụng

### Phương Pháp 1: Chạy Bằng File Batch (KHUYẾN NGHỊ)

1. **Mở File Explorer** và điều hướng đến thư mục dự án
2. **Double-click** vào file `run-sora-script.bat`
3. Script sẽ tự động:
   - Kiểm tra Node.js
   - Cài đặt dependencies (nếu cần)
   - Chạy script Puppeteer

### Phương Pháp 2: Chạy Bằng Command Line

1. **Mở Command Prompt** (cmd) hoặc **PowerShell**
2. Di chuyển đến thư mục dự án:
   ```cmd
   cd đường\dẫn\đến\thư\mục\dự\án
   ```

3. **Cài đặt dependencies** (chỉ cần làm một lần):
   ```cmd
   npm install
   ```

4. **Chạy script**:
   ```cmd
   node sora-with-profile.js
   ```

### Phương Pháp 3: Chạy Bằng npm

```cmd
npm start
```

## ⚙️ Cấu Hình Chrome Profile

Script hiện đang được cấu hình với:

```javascript
executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
userDataDir: 'C:\\Users\\tuyenhm\\AppData\\Local\\Google\\Chrome\\User Data'
args: ['--profile-directory=Profile 14']
```

### Cách Thay Đổi Profile (Nếu Cần)

1. Mở file `sora-with-profile.js` bằng text editor
2. Tìm phần cấu hình `puppeteer.launch()`
3. Thay đổi các giá trị sau:
   - `executablePath`: Đường dẫn đến Chrome
   - `userDataDir`: Thư mục User Data của Chrome
   - `--profile-directory=Profile 14`: Tên profile của bạn

### Cách Tìm Profile Path Của Bạn

1. Mở Chrome
2. Gõ vào thanh địa chỉ: `chrome://version`
3. Tìm dòng **"Profile Path"** - đây là đường dẫn đầy đủ
4. Tách thành:
   - **User Data Dir**: Phần trước "Profile X"
   - **Profile Directory**: "Profile X"

Ví dụ:
- Profile Path: `C:\Users\tuyenhm\AppData\Local\Google\Chrome\User Data\Profile 14`
- User Data Dir: `C:\Users\tuyenhm\AppData\Local\Google\Chrome\User Data`
- Profile Directory: `Profile 14`

## 🔧 Tùy Chỉnh Script

### Chế Độ Headless (Chạy Ngầm)

Trong file `sora-with-profile.js`, thay đổi:

```javascript
headless: false,  // Hiển thị trình duyệt
```

Thành:

```javascript
headless: true,   // Chạy ngầm (không hiển thị)
```

### Thay Đổi Timeout

Tìm dòng:
```javascript
const timeout = 5000;
```

Thay đổi số `5000` (5 giây) thành giá trị mong muốn (đơn vị: milliseconds)

### Thay Đổi Nội Dung Video

Tìm phần `.fill(...)` và thay đổi nội dung mô tả video của bạn

## ❗ Xử Lý Lỗi

### Lỗi: "Node.js chưa được cài đặt"
- Tải và cài đặt Node.js từ: https://nodejs.org/
- Khởi động lại Command Prompt sau khi cài

### Lỗi: "Chrome profile không tìm thấy"
- Kiểm tra lại đường dẫn profile trong file `sora-with-profile.js`
- Đảm bảo Chrome đã đóng hoàn toàn trước khi chạy script

### Lỗi: "Protocol error" hoặc "Target closed"
- Chrome đang được sử dụng bởi tiến trình khác
- Đóng tất cả cửa sổ Chrome và thử lại

### Lỗi: "Timeout exceeded"
- Tăng giá trị `timeout` trong script
- Kiểm tra kết nối internet
- Đảm bảo trang web Sora đang hoạt động

## 📝 Lưu Ý Quan Trọng

1. **Đóng Chrome** hoàn toàn trước khi chạy script (để tránh xung đột với profile)
2. **Đã đăng nhập** tài khoản Sora trong Profile 14 trước
3. Script sẽ **tự động đóng trình duyệt** sau khi hoàn thành
4. Nếu muốn giữ trình duyệt mở, comment dòng `await browser.close();`

## 🆘 Hỗ Trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Node.js đã được cài đặt đúng chưa: `node --version`
2. Dependencies đã được cài đặt chưa: kiểm tra thư mục `node_modules`
3. Đường dẫn Chrome và Profile có chính xác không

## 📜 Giấy Phép

ISC License
