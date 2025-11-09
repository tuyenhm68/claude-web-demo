const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script Puppeteer với tính năng tự động tải video
 *
 * TÍNH NĂNG:
 * - Tạo video trên Sora
 * - Chờ video render xong (5 phút)
 * - Tự động download video
 * - Lưu vào thư mục chỉ định
 */

const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const DOWNLOAD_PATH = 'E:\\temp\\VEO_3_create-16-10\\videos'; // ← THAY ĐỔI ĐƯỜNG DẪN NÀY

(async () => {
    console.log('========================================');
    console.log('  CHẠY PUPPETEER VỚI AUTO DOWNLOAD');
    console.log('========================================\n');

    // Kiểm tra file cookies
    console.log('[1/8] Kiểm tra file cookies...');
    try {
        await fs.access(COOKIES_FILE);
        console.log('[OK] Tìm thấy file cookies!\n');
    } catch (error) {
        console.error('[ERROR] Không tìm thấy file cookies.json!');
        console.error('\n💡 GIẢI PHÁP:');
        console.error('1. Chạy: 1-extract-cookies.bat');
        console.error('2. Sau đó chạy lại script này\n');
        process.exit(1);
    }

    // Đọc cookies
    console.log('[2/8] Đang đọc cookies...');
    const cookiesData = JSON.parse(await fs.readFile(COOKIES_FILE, 'utf-8'));
    console.log(`[OK] Đã đọc ${cookiesData.cookies.length} cookies`);
    console.log(`    Được lấy lúc: ${cookiesData.extractedAt}\n`);

    // Tạo thư mục download nếu chưa có
    console.log('[3/8] Kiểm tra thư mục download...');
    try {
        await fs.mkdir(DOWNLOAD_PATH, { recursive: true });
        console.log(`[OK] Thư mục download: ${DOWNLOAD_PATH}\n`);
    } catch (e) {
        console.log(`[OK] Thư mục đã tồn tại: ${DOWNLOAD_PATH}\n`);
    }

    // Khởi động browser
    console.log('[4/8] Đang khởi động Chrome...');
    const browser = await puppeteer.launch({
        headless: false,
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

    // Cấu hình download path
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: DOWNLOAD_PATH
    });
    console.log(`[OK] Đã cấu hình download path: ${DOWNLOAD_PATH}\n`);

    // Load cookies vào page
    console.log('[5/8] Đang load cookies vào browser...');
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
    console.log('[6/8] Đang mở trang Sora...');
    {
        const targetPage = page;
        await targetPage.goto('https://sora.chatgpt.com/profile', {
            waitUntil: 'networkidle2'
        });
    }
    console.log('[OK] Trang đã tải!\n');

    console.log('[7/8] Đang thực hiện automation...\n');

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
                .fill('Scene in a quiet kitchen at night. The room is dimly lit by the lamp. Near a pile of grocery bags, a lifelike stuffed rabbit lies motionless.\nThere are many crumbs of bread scattered on the floor.\nScene 1:\n- The cat hides in a stuffed rabbit, the rabbit is sitting quiet, its eyes glancing sideways to observe the mouse.\nScene 2:\n- A mouse crawls out from behind the trash can, approaches the stuffed rabbit, the mouse approaches, eats the crumbs of bread that have fallen on the floor.\nScene 3:\n- From inside the stuffed rabbit, the cat suddenly jumps out, with a sudden pounce, the cat grabs the mouse.\nCamera:\n- Low static angle; warm tungsten light; slow zoom to reveal deception.');
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
            console.log('  → Đã click!\n');
        }

        console.log('========================================');
        console.log('  VIDEO ĐANG ĐƯỢC TẠO...');
        console.log('========================================\n');

        console.log('[8/8] Đang chờ video render xong (khoảng 5 phút)...\n');
        console.log('⏱️  Thời gian ước tính: 5 phút');
        console.log('📊 Tiến độ:\n');

        // Đợi 5 phút với progress indicator
        const waitTime = 5 * 60 * 1000; // 5 phút
        const intervalTime = 10 * 1000; // 10 giây
        const steps = waitTime / intervalTime;

        for (let i = 0; i <= steps; i++) {
            const percent = Math.round((i / steps) * 100);
            const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
            const elapsed = Math.floor((i * intervalTime) / 1000);
            const remaining = Math.floor(((steps - i) * intervalTime) / 1000);

            process.stdout.write(`\r[${bar}] ${percent}% | Đã đợi: ${elapsed}s | Còn lại: ${remaining}s`);

            if (i < steps) {
                await new Promise(resolve => setTimeout(resolve, intervalTime));
            }
        }

        console.log('\n\n[OK] Đã đợi xong 5 phút!\n');

        // Tìm và click nút "..." (More options)
        console.log('  → Đang tìm nút "More options" (...)...');

        try {
            // Đợi nút "..." xuất hiện
            await page.waitForSelector('button[aria-label*="More"], button[aria-label*="more"], button:has-text("...")', {
                timeout: 30000
            });

            console.log('  → Đã tìm thấy nút "..."!');
            console.log('  → Đang click nút "..."...');

            // Click nút "..."
            await page.click('button[aria-label*="More"], button[aria-label*="more"]');

            // Đợi menu xuất hiện
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('  → Đã mở menu!');
            console.log('  → Đang tìm nút "Download"...');

            // Click nút Download
            await page.click('button:has-text("Download"), [role="menuitem"]:has-text("Download"), a:has-text("Download")');

            console.log('  → Đã click nút Download!\n');

            // Đợi file tải về
            console.log('  → Đang đợi file tải về...');
            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log('\n========================================');
            console.log('  HOÀN TẤT!');
            console.log('========================================\n');

            console.log('✅ Video đã được tải về!');
            console.log(`📁 Thư mục: ${DOWNLOAD_PATH}`);
            console.log(`🎬 File: [tên file tự động từ Sora].mp4\n`);

        } catch (downloadError) {
            console.error('\n⚠️  KHÔNG TÌM THẤY NÚT DOWNLOAD TỰ ĐỘNG');
            console.error('Vui lòng tải thủ công:\n');
            console.error('1. Tìm nút "..." ở góc phải video');
            console.error('2. Click vào nút "..."');
            console.error('3. Click "Download"');
            console.error(`4. File sẽ được lưu vào: ${DOWNLOAD_PATH}\n`);

            console.log('⏸️  Chrome sẽ giữ mở để bạn tải thủ công...');
            console.log('   Nhấn Enter để đóng Chrome...\n');

            // Đợi người dùng nhấn Enter
            await new Promise(resolve => {
                process.stdin.once('data', () => resolve());
            });
        }

    } catch (error) {
        console.error('\n[ERROR] Automation thất bại:');
        console.error(error.message);

        if (error.message.includes('Timeout') || error.message.includes('not found')) {
            console.error('\n💡 NGUYÊN NHÂN CÓ THỂ:');
            console.error('1. Cookies đã hết hạn (cần đăng nhập lại)');
            console.error('2. Giao diện Sora đã thay đổi');
            console.error('3. Trang tải chậm\n');
            console.error('💡 GIẢI PHÁP:');
            console.error('1. Chạy lại: 1-extract-cookies.bat');
            console.error('2. Đăng nhập vào Sora trong Chrome profile');
            console.error('3. Lấy cookies mới\n');
        }
    }

    await browser.close();

})().catch(err => {
    console.error('\n[FATAL ERROR]', err);
    process.exit(1);
});
