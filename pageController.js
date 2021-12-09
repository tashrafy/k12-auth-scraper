const fs = require('fs');
const pageScraper = require('./pageScraper');
const schoolDistricts = require('./school_districts.json');

async function scrapeAll(browserInstance){
    let browser;
    let urls = [];

    try {
        for (let i = 0; i <= schoolDistricts.length; i+=2) {
            browser = await browserInstance;
            const schoolEntry = {
                ...schoolDistricts[i]
            };
            const url = schoolEntry['Website'];
            const school = schoolEntry['School District Name'];
            
            console.log(i, 'school', school);

            if (url) {
                let results;
                try {
                    results = await pageScraper.scraper(browser, url);
                    console.log(results)
                    for (let y = 0; y < results.length; y++) {
                        const entry = results[y];

                        urls.push({
                            ...schoolEntry,
                            'Login Link': entry.link,
                            'Login Type': entry.loginType,
                            'HTML Selector': entry.selector
                        });
                    }
                } catch (err) {
                    console.log(`Error for ${url}`, err);
                }
            }
            // await pageScraper.scraper(browser);
        }
    } catch(err) {
        console.log("Could not resolve the browser instance => ", err);
    }

    fs.writeFile('public/school_districts_eval.json', JSON.stringify(urls), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

module.exports = (browserInstance) => scrapeAll(browserInstance)