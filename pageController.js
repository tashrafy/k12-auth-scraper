const pageScraper = require('./pageScraper');
const schoolDistricts = require('./school_districts.json');

async function scrapeAll(browserInstance){
    let browser;
    let urls = [];

    try {
        for (let i = 0; i <= 1; i++) {
            browser = await browserInstance;
            const url = schoolDistricts[i]['Website'];
            const school = schoolDistricts[i]['School District Name'];

            if (url) {
                let results;
                try {
                    results = await pageScraper.scraper(browser, url);
                    urls.push({
                        [school]: results
                    });
                } catch (err) {
                    console.log(`Error for ${url}`, err);
                }
            }
            // await pageScraper.scraper(browser);
        }
    } catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
    console.log(urls, "urls")
}

module.exports = (browserInstance) => scrapeAll(browserInstance)