const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script TEST DOWNLOAD - Chỉ test chức năng download
 *
 * YÊU CẦU:
 * - Đã có video trên trang Sora Drafts
 * - Đã có cookies.json
 *
 * CÁCH DÙNG:
 * 1. Đảm bảo có video sẵn trên https://sora.chatgpt.com/drafts
 * 2. Chạy: node test-download.js
 * 3. Script sẽ tự động download video đầu tiên từ drafts
 *
 * LƯU Ý:
 * - Script sử dụng các selector chính xác từ kịch bản Puppeteer gốc
 * - Truy cập /drafts thay vì /profile
 * - Timeout mặc định: 5 giây
 */

const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const DOWNLOAD_PATH = 'E:\\temp\\VEO_3_create-16-10\\videos'; // ← Thư mục lưu video

(async () => {
    console.log('========================================');
    console.log('  TEST DOWNLOAD VIDEO TỪ SORA');
    console.log('========================================\n');

    // Kiểm tra cookies
    console.log('[1/6] Kiểm tra cookies...');
    try {
        await fs.access(COOKIES_FILE);
        console.log('[OK] Tìm thấy cookies.json\n');
    } catch (error) {
        console.error('[ERROR] Không tìm thấy cookies.json!');
        console.error('Chạy: 1-extract-cookies.bat\n');
        process.exit(1);
    }

    // Đọc cookies
    const cookiesData = JSON.parse(await fs.readFile(COOKIES_FILE, 'utf-8'));
    console.log('[OK] Đã đọc cookies\n');

    // Tạo thư mục download
    console.log('[2/6] Tạo thư mục download...');
    await fs.mkdir(DOWNLOAD_PATH, { recursive: true });
    console.log(`[OK] Thư mục: ${DOWNLOAD_PATH}\n`);

    // Khởi động Chrome
    console.log('[3/6] Khởi động Chrome...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    console.log('[OK] Chrome đã khởi động\n');

    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    // Set viewport theo kịch bản gốc
    await page.setViewport({
        width: 1126,
        height: 945
    });

    // Cấu hình download path
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: DOWNLOAD_PATH
    });
    console.log('[OK] Đã cấu hình download path\n');

    // Load cookies
    console.log('[4/6] Load cookies...');
    await page.setCookie(...cookiesData.cookies);
    console.log('[OK] Cookies đã load\n');

    // Đi tới trang Sora Drafts
    console.log('[5/6] Mở trang Sora drafts...');
    await page.goto('https://sora.chatgpt.com/drafts');
    console.log('[OK] Trang đã tải\n');

    console.log('[6/6] Thực hiện download...\n');

    try {
        const targetPage = page;

        // Bước 1: Click vào video đầu tiên
        console.log('  → Đang click vào video...');
        await puppeteer.Locator.race([
            targetPage.locator('div.relative > div > div > div:nth-of-type(1) video'),
            targetPage.locator('::-p-xpath(/html/body/main/div[3]/div[1]/div/div/div/div/div[2]/div/div/div[1]/div/div/a/video)'),
            targetPage.locator(':scope >>> div.relative > div > div > div:nth-of-type(1) video')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 62,
                y: 75,
              },
            });
        console.log('  → Đã click vào video');

        // Bước 2: Click vào nút "..." (More options) ở góc phải
        console.log('  → Đang click nút "..." ở góc phải...');
        await puppeteer.Locator.race([
            targetPage.locator('body'),
            targetPage.locator('::-p-xpath(/html/body)'),
            targetPage.locator(':scope >>> body')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 1071,
                y: 62,
              },
            });
        console.log('  → Đã click nút "..."');

        // Bước 3: Click vào nút Download
        console.log('  → Đang click nút Download...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Download)'),
            targetPage.locator('#radix-\\:r23\\: > div:nth-of-type(1)'),
            targetPage.locator('::-p-xpath(//*[@id="radix-:r23:"]/div[1])'),
            targetPage.locator(':scope >>> #radix-\\:r23\\: > div:nth-of-type(1)'),
            targetPage.locator('::-p-text(Download)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 76,
                y: 20,
              },
            });
        console.log('  → Đã click nút Download!\n');

        // Đợi file bắt đầu tải
        console.log('  → Đang đợi file tải về...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('\n========================================');
        console.log('  KIỂM TRA KẾT QUẢ:');
        console.log('========================================\n');

        // Kiểm tra thư mục download
        const files = await fs.readdir(DOWNLOAD_PATH);
        const mp4Files = files.filter(f => f.endsWith('.mp4'));
        const crdownloadFiles = files.filter(f => f.endsWith('.crdownload'));

        if (mp4Files.length > 0) {
            console.log('✅ THÀNH CÔNG! Đã tìm thấy file:\n');
            mp4Files.forEach(f => {
                console.log(`   📹 ${f}`);
            });
            console.log(`\n📁 Thư mục: ${DOWNLOAD_PATH}\n`);
        } else if (crdownloadFiles.length > 0) {
            console.log('⏳ File đang tải...\n');
            crdownloadFiles.forEach(f => {
                console.log(`   ⬇️  ${f}`);
            });
            console.log('\n💡 Đợi thêm vài giây để download hoàn tất\n');
        } else {
            console.log('⚠️  Chưa thấy file .mp4 trong thư mục');
            console.log('   Có thể file đang tải hoặc có tên khác\n');
            if (files.length > 0) {
                console.log('📂 Các file trong thư mục:');
                files.forEach(f => console.log(`   - ${f}`));
            } else {
                console.log('📂 Thư mục trống');
            }
            console.log('');
        }

        console.log('💡 LƯU Ý:');
        console.log('- File có thể có tên .crdownload khi đang tải');
        console.log('- Đợi thêm vài giây nếu file vẫn đang download');
        console.log('- Kiểm tra thư mục Downloads mặc định nếu không thấy\n');

        console.log('⏸️  Chrome sẽ mở để bạn kiểm tra');
        console.log('   Nhấn ENTER để đóng Chrome...\n');

        await new Promise(resolve => {
            process.stdin.once('data', () => resolve());
        });

    } catch (error) {
        console.error('\n❌ LỖI:', error.message);
        console.error('\n💡 GỢI Ý:');
        console.error('1. Đảm bảo có video trên https://sora.chatgpt.com/drafts');
        console.error('2. Cookies có thể đã hết hạn - chạy lại: 1-extract-cookies.bat');
        console.error('3. Selector có thể thay đổi - cần cập nhật code');
        console.error('4. Thử chạy lại sau vài giây\n');

        console.log('⏸️  Chrome sẽ mở để bạn xem lỗi');
        console.log('   Nhấn ENTER để đóng Chrome...\n');

        await new Promise(resolve => {
            process.stdin.once('data', () => resolve());
        });
    }

    await browser.close();
    console.log('✅ Đã đóng Chrome\n');

})().catch(err => {
    console.error('\n[FATAL ERROR]', err);
    process.exit(1);
});
