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
        console.log('urls', urls)
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            console.log('link', link)
            let dataObj = {};
            let newPage = await browser.newPage();
            try {
                await newPage.goto(link);
                let var1, var2;

                try {
                    var1 = await newPage.waitForSelector('input[name=username]');
                    dataObj['isRegularLogin'] = true;
                } catch (e) {}
                
                try {
                    var2 = await newPage.waitForSelector('input[name=UserName]')
                    dataObj['isRegularLogin'] = true;
                } catch (e) {}

            } catch (goToError) {
                dataObj['isRegularLogin'] = false;
                console.log(`Render link fail ${link}`, goToError);
            }
            console.log('dataObj', dataObj)
            resolve(dataObj);
            await newPage.close();
        });

        for(link in urls){
            let currentPageData = await pagePromise(urls[link]);
            // scrapedData.push(currentPageData);
            console.log('currentPageData', currentPageData);
        }


        return urls;
    }
}

module.exports = scraperObject;