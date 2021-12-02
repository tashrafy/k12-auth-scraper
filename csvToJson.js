const csv2json = require('csv2json');
const fs = require('fs');

async function csvToJson() {
    try {
        await fs.createReadStream('school_districts.csv')
          .pipe(csv2json())
          .pipe(fs.createWriteStream('school_districts.json'));
    } catch(err) {
        console.log("There was an error converting the csv file to json:", err);
    }
}

module.exports = csvToJson()