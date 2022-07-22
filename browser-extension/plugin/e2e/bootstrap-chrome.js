const puppeteer = require('puppeteer');
const { sleep } = require('./utils');

async function bootstrap(options = {}) {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--disable-extensions-except=./dist`, `--load-extension=./dist`],
        defaultViewport: null,
        slowMo: true
    });
    const appPage = await browser.newPage();
    await appPage.goto('https://twitter.com/search?q=kutti');

    const targets = await browser.targets();
    const extensionTarget = targets.find(
        (target) => target.type() === 'service_worker'
    );
    const partialExtensionUrl = extensionTarget.url() || '';
    const [, , extensionId] = partialExtensionUrl.split('/');

    console.log({ extensionId });

    const extPage = await browser.newPage();
    const extensionUrl = `chrome-extension://${extensionId}/options.html`;
    await extPage.goto(extensionUrl, { waitUntil: 'load' });

    return {
        appPage,
        browser,
        extensionUrl,
        extPage
    };
}

(async function startChrome() {
    const { extPage, appPage } = await bootstrap();

    // await appPage.bringToFront();
    // await sleep(5000);
    await extPage.bringToFront();
    await extPage.click('#app_btn_activate');
    await sleep(150);
    await extPage.click('#app_nav_preference');
    await extPage.type('#app_field_email', 'denny@tattle.co.in');
    await extPage.click('#app_btn_save');
    await sleep(500);
    await extPage.evaluate(() => {
        alert(JSON.stringify(localStorage));
    });
    // await sleep(5000);
    // await sleep(10000);
    // await browser.close();
    // test if slur replacement is working
    // document.getElementsByTagname("article")[0].text.search("▓")
})();
