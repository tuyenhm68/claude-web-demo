const puppeteer = require('puppeteer');

/**
 * PHƯƠNG ÁN 3: Sử dụng Remote Debugging
 *
 * CÁCH SỬ DỤNG:
 * 1. Đóng tất cả Chrome
 * 2. Chạy script: start-chrome-debug.bat
 * 3. Chạy script này: node sora-remote-debug.js
 *
 * Cách này đáng tin cậy hơn vì:
 * - Không cần lo về profile lock
 * - Sử dụng Chrome với profile thật
 * - Ổn định hơn
 */

(async () => {
    console.log('Đang kết nối tới Chrome với Remote Debugging...');

    try {
        // Kết nối tới Chrome đang chạy với remote debugging
        const browser = await puppeteer.connect({
            browserURL: 'http://127.0.0.1:9222',
            defaultViewport: null
        });

        console.log('Đã kết nối thành công!');

        const pages = await browser.pages();
        let page;

        // Tìm tab đã mở hoặc tạo tab mới
        if (pages.length > 0) {
            page = pages[0];
        } else {
            page = await browser.newPage();
        }

        const timeout = 10000;
        page.setDefaultTimeout(timeout);

        {
            const targetPage = page;
            await targetPage.setViewport({
                width: 1350,
                height: 945
            })
        }

        // Đi tới trang Sora
        {
            const targetPage = page;
            console.log('Đang mở trang Sora...');
            await targetPage.goto('https://sora.chatgpt.com/profile');
        }

        console.log('Đang chờ trang tải...');

        // Click vào textarea
        {
            const targetPage = page;
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
            console.log('Đang điền nội dung...');
            await puppeteer.Locator.race([
                targetPage.locator('::-p-aria(Describe your video...)'),
                targetPage.locator('textarea'),
                targetPage.locator('::-p-xpath(/html/body/main/div[3]/div[2]/div/div/div[2]/div/div[2]/div[3]/div[1]/div/textarea)'),
                targetPage.locator(':scope >>> textarea')
            ])
                .setTimeout(timeout)
                .fill('Scene in a quiet kitchen at night. The room is dimly lit by the lamp. Near a pile of grocery bags, a lifelike stuffed rabbit lies motionless.\nThere are many crumbs of bread scattered on the floor.\nScene 1:\n- The cat hides in a stuffed rabbit, the rabbit is sitting quietly, its eyes glancing sideways to observe the mouse.\nScene 2:\n- A mouse crawls out from behind the trash can, approaches the stuffed rabbit, the mouse approaches, eats the crumbs of bread that have fallen on the floor.\nScene 3:\n- From inside the stuffed rabbit, the cat suddenly jumps out, with a sudden pounce, the cat grabs the mouse.\nCamera:\n- Low static angle; warm tungsten light; slow zoom to reveal deception.');
        }

        // Click nút Create video
        {
            const targetPage = page;
            console.log('Đang click nút Create video...');
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
        }

        console.log('\n========================================');
        console.log('HOÀN TẤT! Video đang được tạo...');
        console.log('Chrome vẫn mở để bạn xem kết quả');
        console.log('========================================\n');

        // KHÔNG đóng browser vì chúng ta chỉ connect, không launch
        await browser.disconnect();

    } catch (error) {
        console.error('\n[ERROR] Không thể kết nối tới Chrome!');
        console.error('Vui lòng đảm bảo:');
        console.error('1. Đã chạy start-chrome-debug.bat trước');
        console.error('2. Chrome đang mở với port 9222');
        console.error('\nChi tiết lỗi:', error.message);
        process.exit(1);
    }

})().catch(err => {
    console.error('\n[ERROR] Đã xảy ra lỗi:');
    console.error(err);
    process.exit(1);
});
