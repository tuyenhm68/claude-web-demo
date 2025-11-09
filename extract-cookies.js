const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

/**
 * Script để lấy cookies từ Chrome profile và lưu lại
 *
 * CÁCH SỬ DỤNG:
 * 1. Chạy: node extract-cookies.js
 * 2. Chrome sẽ mở với Profile 1
 * 3. Đăng nhập vào Sora trong Chrome
 * 4. Nhấn Enter trong console để lưu cookies
 * 5. Chrome sẽ đóng và cookies được lưu vào cookies.json
 */

const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const PROFILE_PATH = 'E:\\temp\\VEO_3_create-16-10\\creatve_viodeo\\profile';
const PROFILE_DIR = 'Profile 1';

// Hàm đợi người dùng nhấn Enter
function waitForUserInput(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(message, () => {
            rl.close();
            resolve();
        });
    });
}

(async () => {
    console.log('========================================');
    console.log('  LẤY COOKIES TỪ CHROME PROFILE');
    console.log('========================================\n');

    console.log('[1/5] Đang khởi động Chrome với profile...');

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

        console.log('[2/5] Đang mở trang Sora...');
        const page = await browser.newPage();
        await page.goto('https://sora.chatgpt.com/', { waitUntil: 'domcontentloaded' });

        console.log('[OK] Trang đã mở!\n');

        // Đợi người dùng đăng nhập
        console.log('========================================');
        console.log('  HƯỚNG DẪN:');
        console.log('========================================');
        console.log('1. Chrome đã mở trang Sora');
        console.log('2. Hãy ĐĂNG NHẬP vào Sora trong Chrome');
        console.log('3. Sau khi đăng nhập xong, quay lại console này');
        console.log('4. Nhấn ENTER để lưu cookies\n');
        console.log('⚠️  LƯU Ý: ĐỪNG ĐÓNG Chrome! Script sẽ tự đóng\n');
        console.log('========================================\n');

        await waitForUserInput('Nhấn ENTER sau khi đã đăng nhập xong... ');

        console.log('\n[3/5] Đang trích xuất cookies...');

        // Lấy cookies từ tất cả pages
        const pages = await browser.pages();
        let allCookies = [];

        for (const p of pages) {
            try {
                const pageCookies = await p.cookies();
                allCookies = allCookies.concat(pageCookies);
            } catch (e) {
                // Ignore errors from closed pages
            }
        }

        // Loại bỏ duplicates
        const cookies = Array.from(
            new Map(allCookies.map(c => [`${c.name}-${c.domain}`, c])).values()
        );

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

        console.log('[4/5] Đang lưu cookies vào file...');
        await fs.writeFile(
            COOKIES_FILE,
            JSON.stringify(cookiesData, null, 2),
            'utf-8'
        );

        console.log('[OK] Đã lưu vào:', COOKIES_FILE);

        console.log('\n[5/5] Đang đóng Chrome...');
        await browser.close();
        console.log('[OK] Đã đóng Chrome!\n');

        console.log('========================================');
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
        console.log('- Cookies có thể hết hạn sau vài ngày/tuần');

        console.log('\n📌 BƯỚC TIẾP THEO:');
        console.log('- Chạy: 2-run-with-cookies.bat');
        console.log('- Hoặc: node sora-with-cookies.js\n');

    } catch (error) {
        console.error('\n[ERROR] Đã xảy ra lỗi:');
        console.error(error.message);

        if (error.message.includes('Failed to launch')) {
            console.error('\n💡 GIẢI PHÁP:');
            console.error('1. Đóng TẤT CẢ Chrome thủ công');
            console.error('2. Hoặc chạy: kill-chrome.bat (chọn Y)');
            console.error('3. Thử lại: node extract-cookies.js');
        }

        if (browser) {
            try {
                await browser.close();
            } catch (e) {
                // Ignore close errors
            }
        }
        process.exit(1);
    }

})().catch(err => {
    console.error('\n[FATAL ERROR]', err);
    process.exit(1);
});
