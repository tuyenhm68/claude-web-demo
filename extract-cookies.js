const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script để lấy cookies từ Chrome profile và lưu lại
 *
 * CÁCH SỬ DỤNG:
 * 1. Đảm bảo đã đóng tất cả Chrome
 * 2. Chạy: node extract-cookies.js
 * 3. Cookies sẽ được lưu vào file cookies.json
 */

const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const PROFILE_PATH = 'E:\\temp\\VEO_3_create-16-10\\creatve_viodeo\\profile';
const PROFILE_DIR = 'Profile 1';

(async () => {
    console.log('========================================');
    console.log('  LẤY COOKIES TỪ CHROME PROFILE');
    console.log('========================================\n');

    console.log('[1/4] Đang khởi động Chrome với profile...');

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: 'E:\\temp\\VEO_3_create-16-10\\creatve_viodeo\\browser133\\chrome.exe',
            userDataDir: PROFILE_PATH,
            args: [
                `--profile-directory=${PROFILE_DIR}`,
                '--no-first-run',
                '--no-default-browser-check',
            ],
            headless: false,
        });

        console.log('[OK] Chrome đã khởi động!\n');

        console.log('[2/4] Đang mở trang Sora để lấy cookies...');
        const page = await browser.newPage();
        await page.goto('https://sora.chatgpt.com/', { waitUntil: 'networkidle2' });

        // Chờ một chút để đảm bảo trang tải xong
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('[OK] Trang đã tải!\n');

        console.log('[3/4] Đang trích xuất cookies...');
        const cookies = await page.cookies();

        // Lọc chỉ lấy cookies quan trọng
        const importantCookies = cookies.filter(cookie =>
            cookie.domain.includes('chatgpt.com') ||
            cookie.domain.includes('sora.com') ||
            cookie.domain.includes('openai.com')
        );

        console.log(`[OK] Đã lấy ${importantCookies.length} cookies!\n`);

        // Lưu cookies kèm metadata
        const cookiesData = {
            extractedAt: new Date().toISOString(),
            profile: PROFILE_DIR,
            url: 'https://sora.chatgpt.com/',
            cookies: importantCookies,
            stats: {
                total: importantCookies.length,
                domains: [...new Set(importantCookies.map(c => c.domain))]
            }
        };

        console.log('[4/4] Đang lưu cookies vào file...');
        await fs.writeFile(
            COOKIES_FILE,
            JSON.stringify(cookiesData, null, 2),
            'utf-8'
        );

        console.log('[OK] Đã lưu vào:', COOKIES_FILE);
        console.log('\n========================================');
        console.log('  HOÀN TẤT!');
        console.log('========================================\n');

        console.log('Thông tin cookies:');
        console.log(`- Tổng số: ${cookiesData.stats.total}`);
        console.log(`- Domains: ${cookiesData.stats.domains.join(', ')}`);
        console.log(`- File: ${COOKIES_FILE}`);
        console.log(`- Thời gian: ${cookiesData.extractedAt}`);

        console.log('\n⚠️  LƯU Ý:');
        console.log('- File cookies.json chứa thông tin nhạy cảm');
        console.log('- KHÔNG chia sẻ file này với người khác');
        console.log('- KHÔNG commit vào Git');
        console.log('- Cookies có thể hết hạn sau vài ngày/tuần\n');

        await browser.close();

    } catch (error) {
        console.error('\n[ERROR] Đã xảy ra lỗi:');
        console.error(error.message);

        if (error.message.includes('Failed to launch')) {
            console.error('\n💡 GIẢI PHÁP:');
            console.error('1. Đóng tất cả Chrome: kill-chrome.bat');
            console.error('2. Thử lại: node extract-cookies.js');
        }

        if (browser) {
            await browser.close();
        }
        process.exit(1);
    }

})().catch(err => {
    console.error('\n[FATAL ERROR]', err);
    process.exit(1);
});
