const puppeteer = require('puppeteer'); // v23.0.0 or later

/**
 * PHƯƠNG ÁN DỰ PHÒNG: Script không sử dụng Chrome profile
 * Sử dụng script này nếu script chính (sora-with-profile.js) gặp lỗi
 *
 * LƯU Ý: Bạn cần đăng nhập thủ công vào Sora khi Chrome mở lên
 */

(async () => {
    console.log('Đang khởi động Chrome (không dùng profile)...');
    console.log('LƯU Ý: Bạn sẽ cần đăng nhập thủ công vào Sora!');

    const browser = await puppeteer.launch({
        headless: false, // Hiển thị trình duyệt
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();
    const timeout = 30000; // Tăng timeout lên 30 giây để có thời gian đăng nhập
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

    // Chờ người dùng đăng nhập (nếu chưa đăng nhập)
    console.log('\n========================================');
    console.log('HƯỚNG DẪN:');
    console.log('1. Nếu chưa đăng nhập, hãy đăng nhập vào Sora');
    console.log('2. Sau khi đăng nhập xong, script sẽ tự động tiếp tục');
    console.log('========================================\n');

    // Chờ textarea xuất hiện (nghĩa là đã đăng nhập thành công)
    {
        const targetPage = page;
        console.log('Đang chờ trang Sora tải...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Describe your video...)'),
            targetPage.locator('textarea'),
        ])
            .setTimeout(timeout)
            .wait();
        console.log('Trang đã tải xong!');
    }

    // Click vào textarea
    {
        const targetPage = page;
        console.log('Đang click vào textarea...');
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
        console.log('Đang điền nội dung video...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Describe your video...)'),
            targetPage.locator('textarea'),
            targetPage.locator('::-p-xpath(/html/body/main/div[3]/div[2]/div/div/div[2]/div/div[2]/div[3]/div[1]/div/textarea)'),
            targetPage.locator(':scope >>> textarea')
        ])
            .setTimeout(timeout)
            .fill('Scene in a quiet kitchen at night. The room is dimly lit by the lamp. Near a pile of grocery bags, a lifelike stuffed rabbit lies motionless.\nThere are many crumbs of bread scattered on the floor.\nScene 1:\n- The cat hides in a stuffed rabbit, the rabbit is sitting quietly, its eyes glancing sideways to observe the mouse.\nScene 2:\n- A mouse crawls out from behind the trash can, approaches the stuffed rabbit, the mouse approaches, eats the crumbs of bread that have fallen on the floor.\nScene 3:\n- From inside the stuffed rabbit, the cat suddenly jumps out, with a sudden pounce, the cat grabs the mouse.\nCamera:\n- Low static angle; warm tungsten light; slow zoom to reveal deception.');
        console.log('Đã điền nội dung!');
    }

    // Click nút Create video
    {
        const targetPage = page;
        console.log('Đang click nút "Create video"...');
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
        console.log('Đã click nút Create video!');
    }

    console.log('\n========================================');
    console.log('HOÀN TẤT! Video đang được tạo...');
    console.log('========================================\n');

    // Chờ 5 giây trước khi đóng để xem kết quả
    console.log('Script sẽ đóng trình duyệt sau 5 giây...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();

})().catch(err => {
    console.error('\n[ERROR] Đã xảy ra lỗi:');
    console.error(err);
    console.error('\nVui lòng kiểm tra lại và thử lại!');
    process.exit(1);
});
