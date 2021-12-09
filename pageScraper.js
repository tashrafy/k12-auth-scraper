const { WHITELISTED_LOGIN_SELECTORS, WHITELISTED_SSO_SELECTORS } = require("./selectors");

const scraperObject = {
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        // Navigate to the selected page
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('body');
        // Get all links on current page
        let urls = await page.$$eval('ul > li', links => {
            // Extract the links from the data
            links = links.map(el => el.querySelector('a') && el.querySelector('a').href)
            // Make sure the links reference possible login pages
            links = links.filter(link => link && link.toLowerCase().indexOf("login") !== -1)
            return links;
        });
        
        console.log('login urls identified:', urls);

        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            console.log('navigating to link:', link)
            let dataObj = {
                link,
            };
            let newPage = await browser.newPage();
            try {
                await newPage.goto(link, {
                    waitUntil: 'networkidle2'
                });

                if (link.indexOf('login.microsoftonline.com') > -1 || link.indexOf('accounts.google.com') > -1) {
                    dataObj['loginType'] = 'sso';
                    resolve(dataObj);
                    await newPage.close();
                    return;
                }

                for (const key in WHITELISTED_SSO_SELECTORS) {
                    let selector = WHITELISTED_SSO_SELECTORS[key];
                    // console.log('key', key, selector)
                    try {
                        let elHandle = await newPage.waitForSelector(selector, {
                            visible: true,
                            timeout: 2000
                        });
                        console.log('selector found', selector)
                        dataObj['loginType'] = 'sso';
                        dataObj['selector'] = selector;
                        break;
                    } catch (e) {
                        // console.log(`unable to identify selector ${selector}`, e);
                    }
                }

                if (!dataObj['loginType']) {
                    for (const key in WHITELISTED_LOGIN_SELECTORS) {
                        let selector = WHITELISTED_LOGIN_SELECTORS[key];
                        console.log('key', key, selector)
                        try {
                            let elHandle = await newPage.waitForSelector(selector, {
                                visible: true,
                                timeout: 2000
                            });
                            console.log('selector found', selector)
                            dataObj['loginType'] = 'basic';
                            dataObj['selector'] = selector;
                            break;
                        } catch (e) {
                            // console.log(`unable to identify selector ${selector}`, e);
                        }
                    }
                }
                
            } catch (goToError) {
                dataObj['loginType'] = null;
                // console.log(`Render link fail ${link}`, goToError);
            }
            resolve(dataObj);
            console.log('closing link', link)
            await newPage.close();
        });

        const urlData = [];
        for(link in urls){
            let currentPageData = await pagePromise(urls[link]);
            // scrapedData.push(currentPageData);
            console.log('school scrape info:', currentPageData);
            urlData.push(currentPageData);
        }
        await page.close();
        return urlData;
    }
}

module.exports = scraperObject;