const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script Puppeteer sử dụng cookies đã lưu
 *
 * CÁCH SỬ DỤNG:
 * 1. Chạy extract-cookies.js trước để lấy cookies
 * 2. Chạy script này: node sora-with-cookies.js
 *
 * ƯU ĐIỂM:
 * - Không cần Chrome profile
 * - Không lo bị lock profile
 * - Chạy nhanh hơn
 * - Có thể chạy headless
 */

const COOKIES_FILE = path.join(__dirname, 'cookies.json');

(async () => {
    console.log('========================================');
    console.log('  CHẠY PUPPETEER VỚI COOKIES');
    console.log('========================================\n');

    // Kiểm tra file cookies
    console.log('[1/6] Kiểm tra file cookies...');
    try {
        await fs.access(COOKIES_FILE);
        console.log('[OK] Tìm thấy file cookies!\n');
    } catch (error) {
        console.error('[ERROR] Không tìm thấy file cookies.json!');
        console.error('\n💡 GIẢI PHÁP:');
        console.error('1. Chạy: node extract-cookies.js');
        console.error('2. Sau đó chạy lại script này\n');
        process.exit(1);
    }

    // Đọc cookies
    console.log('[2/6] Đang đọc cookies...');
    const cookiesData = JSON.parse(await fs.readFile(COOKIES_FILE, 'utf-8'));
    console.log(`[OK] Đã đọc ${cookiesData.cookies.length} cookies`);
    console.log(`    Được lấy lúc: ${cookiesData.extractedAt}\n`);

    // Kiểm tra cookies có quá cũ không
    const extractedDate = new Date(cookiesData.extractedAt);
    const daysSinceExtracted = (new Date() - extractedDate) / (1000 * 60 * 60 * 24);
    if (daysSinceExtracted > 7) {
        console.warn('⚠️  CẢNH BÁO: Cookies đã cũ hơn 7 ngày!');
        console.warn('    Nên chạy lại extract-cookies.js để cập nhật\n');
    }

    // Khởi động browser
    console.log('[3/6] Đang khởi động Chrome...');
    const browser = await puppeteer.launch({
        headless: false, // Đổi thành true nếu muốn chạy ngầm
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    console.log('[OK] Chrome đã khởi động!\n');

    const page = await browser.newPage();
    const timeout = 10000;
    page.setDefaultTimeout(timeout);

    // Load cookies vào page
    console.log('[4/6] Đang load cookies vào browser...');
    await page.setCookie(...cookiesData.cookies);
    console.log('[OK] Cookies đã được load!\n');

    // Set viewport
    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1350,
            height: 945
        })
    }

    // Đi tới trang Sora
    console.log('[5/6] Đang mở trang Sora...');
    {
        const targetPage = page;
        await targetPage.goto('https://sora.chatgpt.com/profile', {
            waitUntil: 'networkidle2'
        });
    }
    console.log('[OK] Trang đã tải!\n');

    console.log('[6/6] Đang thực hiện automation...\n');

    try {
        // Click vào textarea
        {
            const targetPage = page;
            console.log('  → Click vào textarea...');
            await puppeteer.Locator.race([
                targetPage.locator('::-p-aria(Describe your video...)'),
                targetPage.locator('textarea'),
                targetPage.locator('::-p-xpath(/html/body/main/div[3]/div[2]/div/div/div/div/div/div[3]/div[1]/div/textarea)'),
                targetPage.locator(':scope >>> textarea')
            ])
                .setTimeout(timeout)
                .click({
                  offset: {
                    x: 182,
                    y: 23,
                  },
                });
        }

        // Điền nội dung
        {
            const targetPage = page;
            console.log('  → Đang điền nội dung video...');
            await puppeteer.Locator.race([
                targetPage.locator('::-p-aria(Describe your video...)'),
                targetPage.locator('textarea'),
                targetPage.locator('::-p-xpath(/html/body/main/div[3]/div[2]/div/div/div[2]/div/div[2]/div[3]/div[1]/div/textarea)'),
                targetPage.locator(':scope >>> textarea')
            ])
                .setTimeout(timeout)
                .fill('Scene in a quiet kitchen at night. The room is dimly lit by the lamp. Near a pile of grocery bags, a lifelike stuffed rabbit lies motionless.\nThere are many crumbs of bread scattered on the floor.\nScene 1:\n- The cat hides in a stuffed rabbit, the rabbit is sitting quietly, its eyes glancing sideways to observe the mouse.\nScene 2:\n- A mouse crawls out from behind the trash can, approaches the stuffed rabbit, the mouse approaches, eats the crumbs of bread that have fallen on the floor.\nScene 3:\n- From inside the stuffed rabbit, the cat suddenly jumps out, with a sudden pounce, the cat grabs the mouse.\nCamera:\n- Low static angle; warm tungsten light; slow zoom to reveal deception.');
            console.log('  → Đã điền nội dung!');
        }

        // Click nút Create video
        {
            const targetPage = page;
            console.log('  → Click nút "Create video"...');
            await puppeteer.Locator.race([
                targetPage.locator('::-p-aria(Create video) >>>> ::-p-aria([role=\\"image\\"])'),
                targetPage.locator('div:nth-of-type(2) > button.inline-flex > svg'),
                targetPage.locator('::-p-xpath(/html/body/main/div[3]/div[2]/div/div/div[2]/div/div[2]/div[3]/div[2]/div[2]/button[2]/svg)'),
                targetPage.locator(':scope >>> div:nth-of-type(2) > button.inline-flex > svg')
            ])
                .setTimeout(timeout)
                .click({
                  offset: {
                    x: 8,
                    y: 12,
                  },
                });
            console.log('  → Đã click!');
        }

        console.log('\n========================================');
        console.log('  HOÀN TẤT!');
        console.log('========================================\n');

        console.log('✅ Video đang được tạo...');
        console.log('Chrome sẽ đóng sau 5 giây...\n');

        await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
        console.error('\n[ERROR] Automation thất bại:');
        console.error(error.message);

        if (error.message.includes('Timeout') || error.message.includes('not found')) {
            console.error('\n💡 NGUYÊN NHÂN CÓ THỂ:');
            console.error('1. Cookies đã hết hạn (cần đăng nhập lại)');
            console.error('2. Giao diện Sora đã thay đổi');
            console.error('3. Trang tải chậm\n');
            console.error('💡 GIẢI PHÁP:');
            console.error('1. Chạy lại: node extract-cookies.js');
            console.error('2. Đăng nhập vào Sora trong Chrome profile');
            console.error('3. Lấy cookies mới\n');
        }
    }

    await browser.close();

})().catch(err => {
    console.error('\n[FATAL ERROR]', err);
    process.exit(1);
});
