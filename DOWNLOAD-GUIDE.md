# 📥 Hướng Dẫn Tải Video Sora

## 🎯 Tổng Quan

Sau khi Sora tạo video xong (khoảng 5 phút), video sẽ hiển thị và cho phép tải về. Guide này hướng dẫn các cách tải video về thư mục chỉ định.

---

## ⭐ PHƯƠNG ÁN 1: Tự Động Download với Puppeteer (KHUYẾN NGHỊ)

### Ưu Điểm
✅ Hoàn toàn tự động
✅ Lưu trực tiếp vào thư mục chỉ định
✅ Không cần can thiệp thủ công

### Cách Sử Dụng

#### Bước 1: Cấu Hình Thư Mục Download

Mở file `sora-with-download.js`, sửa dòng 16:

```javascript
const DOWNLOAD_PATH = 'E:\\temp\\VEO_3_create-16-10\\videos'; // ← THAY ĐỔI ĐƯỜNG DẪN
```

**Ví dụ:**
```javascript
// Windows:
const DOWNLOAD_PATH = 'D:\\My Videos\\Sora';
const DOWNLOAD_PATH = 'C:\\Users\\YourName\\Documents\\Videos';

// Lưu ý: Dùng \\ thay vì \
```

#### Bước 2: Chạy Script

```cmd
3-run-with-download.bat
```

**Quy trình tự động:**
1. Mở Chrome với cookies
2. Tạo video trên Sora
3. Đợi 5 phút (có progress bar)
4. Tự động click nút "..." → "Download"
5. Video lưu vào thư mục đã cấu hình

---

## 📌 PHƯƠNG ÁN 2: Cấu Hình Chrome Profile Download Path

### Ưu Điểm
✅ Áp dụng cho tất cả downloads
✅ Không cần code thêm

### Cách Làm

Thêm vào `extract-cookies.js` hoặc `sora-with-cookies.js`:

```javascript
const browser = await puppeteer.launch({
    // ... các config khác
    args: [
        // ... các args khác
        `--download.default_directory=${DOWNLOAD_PATH}`,
        `--download.prompt_for_download=false`, // Không hỏi mỗi lần tải
    ]
});
```

---

## 🔧 PHƯƠNG ÁN 3: Di Chuyển File Từ Downloads

### Ưu Điểm
✅ Đơn giản
✅ Không cần config phức tạp

### Cách Làm

Tạo file `move-downloads.js`:

```javascript
const fs = require('fs');
const path = require('path');

const SOURCE = 'C:\\Users\\YourName\\Downloads';
const DEST = 'E:\\temp\\VEO_3_create-16-10\\videos';

// Tìm file mp4 mới nhất
const files = fs.readdirSync(SOURCE)
    .filter(f => f.endsWith('.mp4'))
    .map(f => ({
        name: f,
        time: fs.statSync(path.join(SOURCE, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

if (files.length > 0) {
    const latestFile = files[0].name;
    const sourcePath = path.join(SOURCE, latestFile);
    const destPath = path.join(DEST, latestFile);

    fs.renameSync(sourcePath, destPath);
    console.log(`✅ Đã di chuyển: ${latestFile}`);
    console.log(`📁 Tới: ${DEST}`);
} else {
    console.log('❌ Không tìm thấy file mp4 trong Downloads');
}
```

**Chạy:**
```cmd
node move-downloads.js
```

---

## 🎬 PHƯƠNG ÁN 4: Theo Dõi Thư Mục Downloads

### Tự Động Theo Dõi và Di Chuyển

Tạo file `watch-downloads.js`:

```javascript
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const DOWNLOAD_DIR = 'C:\\Users\\YourName\\Downloads';
const TARGET_DIR = 'E:\\temp\\VEO_3_create-16-10\\videos';

console.log('👀 Đang theo dõi thư mục Downloads...');
console.log(`📂 Downloads: ${DOWNLOAD_DIR}`);
console.log(`📁 Target: ${TARGET_DIR}`);

const watcher = chokidar.watch(path.join(DOWNLOAD_DIR, '*.mp4'), {
    persistent: true,
    ignoreInitial: true
});

watcher.on('add', (filePath) => {
    const fileName = path.basename(filePath);

    // Đợi file tải xong (check file size không đổi)
    let lastSize = 0;
    const checkInterval = setInterval(() => {
        const stats = fs.statSync(filePath);
        const currentSize = stats.size;

        if (currentSize === lastSize && currentSize > 0) {
            clearInterval(checkInterval);

            // Di chuyển file
            const destPath = path.join(TARGET_DIR, fileName);
            fs.renameSync(filePath, destPath);

            console.log(`✅ Đã di chuyển: ${fileName}`);
            console.log(`   → ${TARGET_DIR}`);
        }

        lastSize = currentSize;
    }, 2000); // Check mỗi 2 giây
});

console.log('\n⏸️  Nhấn Ctrl+C để dừng...\n');
```

**Cài package:**
```cmd
npm install chokidar
```

**Chạy:**
```cmd
node watch-downloads.js
```

Để chạy ngầm, script sẽ tự động di chuyển mọi file .mp4 mới từ Downloads sang thư mục đích.

---

## 🔍 SO SÁNH CÁC PHƯƠNG ÁN

| Phương án | Tự động | Dễ dùng | Tin cậy | Khuyến nghị |
|-----------|---------|---------|---------|-------------|
| **1. Puppeteer Download** | ✅✅✅ | ✅✅ | ✅✅✅ | ⭐⭐⭐⭐⭐ |
| **2. Chrome Config** | ✅✅ | ✅✅✅ | ✅✅ | ⭐⭐⭐⭐ |
| **3. Di chuyển sau** | ✅ | ✅✅✅ | ✅✅ | ⭐⭐⭐ |
| **4. Theo dõi folder** | ✅✅✅ | ✅ | ✅✅✅ | ⭐⭐⭐⭐ |

---

## 📝 CHI TIẾT KỸ THUẬT

### Cách Puppeteer Download Hoạt Động

```javascript
// 1. Cấu hình download path
const client = await page.target().createCDPSession();
await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',          // Cho phép tải
    downloadPath: DOWNLOAD_PATH // Thư mục đích
});

// 2. Click download button
await page.click('button[aria-label*="Download"]');

// 3. File tự động lưu vào DOWNLOAD_PATH
```

### Cấu Trúc Nút Download Trên Sora

```html
<!-- Nút "..." (More options) -->
<button aria-label="More options" class="...">
    ...
</button>

<!-- Menu dropdown -->
<div role="menu">
    <button role="menuitem">Download</button>
    <button role="menuitem">Share</button>
    <!-- ... -->
</div>
```

### Selectors Có Thể Dùng

```javascript
// Nút "..."
'button[aria-label*="More"]'
'button[aria-label*="more"]'
'button:has-text("...")'

// Nút Download
'button:has-text("Download")'
'[role="menuitem"]:has-text("Download")'
'a[download]'
```

---

## ⚠️ XỬ LÝ LỖI

### Lỗi: "Không tìm thấy nút Download"

**Nguyên nhân:**
- Giao diện Sora đã thay đổi
- Video chưa render xong
- Selector không đúng

**Giải pháp:**
1. Tăng thời gian đợi (từ 5 phút lên 6-7 phút)
2. Inspect element để tìm selector mới
3. Tải thủ công và ghi lại selector

### Lỗi: "File không xuất hiện trong thư mục"

**Nguyên nhân:**
- Download path không đúng
- Không có quyền ghi vào thư mục

**Giải pháp:**
```cmd
# Kiểm tra thư mục có tồn tại không
dir "E:\temp\VEO_3_create-16-10\videos"

# Tạo thư mục nếu chưa có
mkdir "E:\temp\VEO_3_create-16-10\videos"
```

### Lỗi: "Download bị block"

**Giải pháp:**
```javascript
// Thêm args vào Puppeteer
args: [
    '--disable-features=DownloadBubble',
    '--disable-features=DownloadBubbleV2',
]
```

---

## 💡 TIPS & TRICKS

### 1. Đặt Tên File Theo Thời Gian

```javascript
const timestamp = new Date().toISOString().replace(/:/g, '-');
const newName = `sora_video_${timestamp}.mp4`;
// Đổi tên file sau khi tải
```

### 2. Kiểm Tra File Đã Tải Xong

```javascript
const checkFileComplete = async (filePath) => {
    let lastSize = 0;
    while (true) {
        await new Promise(r => setTimeout(r, 1000));
        const stats = await fs.promises.stat(filePath);
        if (stats.size === lastSize && stats.size > 0) {
            return true; // File đã tải xong
        }
        lastSize = stats.size;
    }
};
```

### 3. Tải Nhiều Video Cùng Lúc

```javascript
// Tạo thư mục con theo ngày
const today = new Date().toISOString().split('T')[0];
const dailyFolder = path.join(DOWNLOAD_PATH, today);
await fs.promises.mkdir(dailyFolder, { recursive: true });
```

---

## 🎯 WORKFLOW HOÀN CHỈNH

```
┌──────────────────────┐
│ 1. Extract cookies   │
│ 1-extract-cookies    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 2. Cấu hình path     │
│ Sửa DOWNLOAD_PATH    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 3. Chạy automation   │
│ 3-run-with-download  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 4. Tạo video (auto)  │
│ Đợi 5 phút           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 5. Download (auto)   │
│ Click ... → Download │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ✅ Video trong folder│
│ Đã chỉ định          │
└──────────────────────┘
```

---

## 📚 TÀI LIỆU THAM KHẢO

- [Puppeteer Downloads Documentation](https://pptr.dev/guides/downloads)
- [Chrome DevTools Protocol - Page.setDownloadBehavior](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-setDownloadBehavior)

---

**Khuyến nghị: Dùng Phương án 1 - Puppeteer Download để tự động hoàn toàn! 🚀**
