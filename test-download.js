const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script TEST DOWNLOAD - Chỉ test chức năng download
 *
 * YÊU CẦU:
 * - Đã có video trên trang Sora
 * - Đã có cookies.json
 *
 * CÁCH DÙNG:
 * 1. Đảm bảo có video sẵn trên https://sora.chatgpt.com/profile
 * 2. Chạy: node test-download.js
 * 3. Script sẽ tự động download video đầu tiên
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
    const timeout = 30000; // 30 giây

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

    // Đi tới trang Sora
    console.log('[5/6] Mở trang Sora...');
    await page.goto('https://sora.chatgpt.com/profile', {
        waitUntil: 'networkidle2'
    });
    console.log('[OK] Trang đã tải\n');

    console.log('[6/6] Thực hiện download...\n');

    try {
        // Đợi một chút để trang load
        await new Promise(r => setTimeout(r, 3000));

        console.log('  → Đang tìm video...');

        // Tìm video đầu tiên (có thể cần điều chỉnh selector)
        // Thử các cách tìm video:
        const videoSelectors = [
            'video',
            '[role="img"]',
            'div[class*="video"]',
            'img[alt*="video"]'
        ];

        let videoFound = false;
        for (const selector of videoSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                console.log(`  → Tìm thấy video với selector: ${selector}`);

                // Click vào video để mở preview
                await page.click(selector);
                console.log('  → Đã click vào video');
                videoFound = true;
                break;
            } catch (e) {
                // Thử selector tiếp theo
            }
        }

        if (!videoFound) {
            console.log('  ⚠️  Không tìm thấy video tự động');
            console.log('  → Vui lòng click vào video THỦ CÔNG');
            console.log('  → Sau đó nhấn ENTER để tiếp tục...\n');

            await new Promise(resolve => {
                process.stdin.once('data', () => resolve());
            });
        }

        // Đợi video preview mở
        await new Promise(r => setTimeout(r, 2000));

        console.log('  → Đang tìm nút "More options" (...)...');

        // Tìm và click nút "..." (More options)
        const moreButtonSelectors = [
            'button[aria-label*="More"]',
            'button[aria-label*="more"]',
            'button[aria-label*="Options"]',
            'button:has-text("⋮")',
            'button:has-text("...")',
            '[data-testid*="more"]',
            '[data-testid*="menu"]'
        ];

        let moreButtonFound = false;
        for (const selector of moreButtonSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                console.log(`  → Tìm thấy nút "..." với selector: ${selector}`);
                await page.click(selector);
                console.log('  → Đã click nút "..."');
                moreButtonFound = true;
                break;
            } catch (e) {
                // Thử selector tiếp theo
            }
        }

        if (!moreButtonFound) {
            console.log('  ⚠️  Không tìm thấy nút "..." tự động');
            console.log('  → Vui lòng click nút "..." THỦ CÔNG');
            console.log('  → Sau đó nhấn ENTER để tiếp tục...\n');

            await new Promise(resolve => {
                process.stdin.once('data', () => resolve());
            });
        }

        // Đợi menu xuất hiện
        await new Promise(r => setTimeout(r, 1000));

        console.log('  → Đang tìm nút "Download"...');

        // Click nút Download - Dùng code của bạn
        try {
            const targetPage = page;
            await puppeteer.Locator.race([
                targetPage.locator('::-p-aria(Download)'),
                targetPage.locator('#radix-\\:r21\\: > div:nth-of-type(1)'),
                targetPage.locator('::-p-xpath(//*[@id="radix-:r21:"]/div[1])'),
                targetPage.locator(':scope >>> #radix-\\:r21\\: > div:nth-of-type(1)'),
                targetPage.locator('::-p-text(Download)')
            ])
                .setTimeout(timeout)
                .click({
                  offset: {
                    x: 76,
                    y: 22,
                  },
                });

            console.log('  → Đã click nút Download!\n');

        } catch (downloadError) {
            // Thử các selector khác
            console.log('  → Thử các selector khác...');

            const downloadSelectors = [
                'button:has-text("Download")',
                '[role="menuitem"]:has-text("Download")',
                'a:has-text("Download")',
                'div:has-text("Download")',
                '[aria-label*="Download"]'
            ];

            let downloadClicked = false;
            for (const selector of downloadSelectors) {
                try {
                    await page.click(selector);
                    console.log(`  → Đã click Download với selector: ${selector}\n`);
                    downloadClicked = true;
                    break;
                } catch (e) {
                    // Thử selector tiếp theo
                }
            }

            if (!downloadClicked) {
                console.log('  ⚠️  Không tìm thấy nút Download tự động');
                console.log('  → Vui lòng click "Download" THỦ CÔNG\n');
            }
        }

        // Đợi file bắt đầu tải
        console.log('  → Đang đợi file tải về...');
        await new Promise(r => setTimeout(r, 3000));

        console.log('\n========================================');
        console.log('  KIỂM TRA KẾT QUẢ:');
        console.log('========================================\n');

        // Kiểm tra thư mục download
        const files = await fs.readdir(DOWNLOAD_PATH);
        const mp4Files = files.filter(f => f.endsWith('.mp4'));

        if (mp4Files.length > 0) {
            console.log('✅ THÀNH CÔNG! Đã tìm thấy file:\n');
            mp4Files.forEach(f => {
                console.log(`   📹 ${f}`);
            });
            console.log(`\n📁 Thư mục: ${DOWNLOAD_PATH}\n`);
        } else {
            console.log('⚠️  Chưa thấy file .mp4 trong thư mục');
            console.log('   Có thể file đang tải hoặc có tên khác\n');
            console.log('📂 Các file trong thư mục:');
            files.forEach(f => console.log(`   - ${f}`));
            console.log('');
        }

        console.log('💡 LƯU Ý:');
        console.log('- Nếu file đang tải, đợi thêm vài giây');
        console.log('- File có thể có tên .crdownload (đang tải)');
        console.log('- Kiểm tra thư mục Downloads mặc định nếu không thấy\n');

        console.log('⏸️  Chrome sẽ mở để bạn kiểm tra');
        console.log('   Nhấn ENTER để đóng Chrome...\n');

        await new Promise(resolve => {
            process.stdin.once('data', () => resolve());
        });

    } catch (error) {
        console.error('\n❌ LỖI:', error.message);
        console.error('\n💡 GỢI Ý:');
        console.error('1. Đảm bảo có video trên trang Sora');
        console.error('2. Thử click thủ công và xem selector');
        console.error('3. Kiểm tra cookies còn hạn không\n');
    }

    await browser.close();
    console.log('✅ Đã đóng Chrome\n');

})().catch(err => {
    console.error('\n[FATAL ERROR]', err);
    process.exit(1);
});
