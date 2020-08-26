const readline = require('readline');
const fs = require('fs');

function readRawTMDBData() {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream('./allTMDBmovies.json'),
            output: process.stdout,
            console: false
        });
        
        let data = [];
        
        readInterface.on('line', function(line) {
            data.push(JSON.parse(line));
        }).on('close', function(line) {
            resolve(data);
        })
    });
};


async function prepRawTMDBData() {
    let preppedData = await readRawTMDBData();
    preppedData = preppedData.map(film => {return film.id});
    fs.writeFile('allTMDBMovies.json', JSON.stringify(preppedData), (err) => {
        if(err) {
            throw(err);
        }
        console.log("JSON data saved to allTMDBMovies.json");
    });
}

prepRawTMDBData();









