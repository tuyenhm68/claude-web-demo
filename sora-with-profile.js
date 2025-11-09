const puppeteer = require('puppeteer'); // v23.0.0 or later
const path = require('path');

(async () => {
    console.log('Đang khởi động Chrome với profile...');

    // Cấu hình để sử dụng Chrome profile có sẵn
    const browser = await puppeteer.launch({
        executablePath: 'E:\\temp\\VEO_3_create-16-10\\creatve_viodeo\\browser133\\chrome.exe',
        userDataDir: 'E:\\temp\\VEO_3_create-16-10\\creatve_viodeo\\profile',
        // Sử dụng Profile 1
        args: [
            '--profile-directory=Profile 1',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
        headless: false, // Chạy ở chế độ có giao diện để bạn xem được
        // Nếu bạn muốn chạy nền thì đổi thành: headless: true
        ignoreDefaultArgs: ['--disable-extensions'],
    });

    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1350,
            height: 945
        })
    }
    {
        const targetPage = page;
        await targetPage.goto('https://sora.chatgpt.com/profile');
    }
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
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Describe your video...)'),
            targetPage.locator('textarea'),
            targetPage.locator('::-p-xpath(/html/body/main/div[3]/div[2]/div/div/div[2]/div/div[2]/div[3]/div[1]/div/textarea)'),
            targetPage.locator(':scope >>> textarea')
        ])
            .setTimeout(timeout)
            .fill('Scene in a quiet kitchen at night. The room is dimly lit by the lamp. Near a pile of grocery bags, a lifelike stuffed rabbit lies motionless.\nThere are many crumbs of bread scattered on the floor.\nScene 1:\n- The cat hides in a stuffed rabbit, the rabbit is sitting quietly, its eyes glancing sideways to observe the mouse.\nScene 2:\n- A mouse crawls out from behind the trash can, approaches the stuffed rabbit, the mouse approaches, eats the crumbs of bread that have fallen on the floor.\nScene 3:\n- From inside the stuffed rabbit, the cat suddenly jumps out, with a sudden pounce, the cat grabs the mouse.\nCamera:\n- Low static angle; warm tungsten light; slow zoom to reveal deception.');
    }
    {
        const targetPage = page;
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

    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
