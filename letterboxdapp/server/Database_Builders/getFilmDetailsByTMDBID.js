const fetch = require('isomorphic-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs');
let filmData = require('./allTMDBMovies.json');
//filmData = filmData.slice(0, 10);
let idFrequencyLog = 10;
//console.log('length of all films', filmData.length); 537613

function createTMDB_API_URL(id) {
    const APIkey = '20fbcd49dc115cbc2807646f1aa53b83';
    const movieID = encodeURI(id);
    const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${APIkey}`;
    return url;
}

function createLetterboxdLink(id) {
    return `https://letterboxd.com/tmdb/${id}`;
}

function getFilmDetailsByID(id) {
    let APIurl = createTMDB_API_URL(id);
    if(id % idFrequencyLog == 0) {
        console.log('getting film Details for film: ', id);
    }
    return fetch(APIurl).then((response) => {
        if(id % idFrequencyLog == 0) {
            console.log('translating response into json for film: ', id);
        }
       return response.json()
    }).catch((err) => {
        console.log(err);
        return null
    });
}

function prepTMDBMoviesData(filmData) {
    filmData = filmData.map(item => {
        return item.id;
    })
    return filmData; //This returns an array of all movie IDs only -> helpful for converting the TMDB Daily Export JSON data to just TMDB IDs
}

async function getAllFilmDetails(filmData) { //This is where the magic happens!
    return Promise.all(filmData.map(async filmID => {
        return await getFilmDetailsByID(filmID);
    })).catch(err => console.log(err));
}

async function getLetterboxdRating(id, browser) {
    let letterboxd_url = createLetterboxdLink(id);
    const page = await browser.newPage();
    await page.goto(letterboxd_url, {waitUntil: 'networkidle2', timeout: 0});
    let rating = await page.evaluate(function() {
        if(document.querySelector('span.average-rating') != null) {
            return parseFloat(document.querySelector('span.average-rating').querySelector('a').innerText);
        } else {
            return null;
        }
    });
    await page.close();
    return rating;
    //finish by fetching and parsing HTML letterboxd Data from fetch(letterboxd_url)
}

async function getLetterboxdRatings(filmData) {
    let args = process.argv;
    let start = args[2];
    let end = args[3];
    //filmData = prepTMDBMoviesData(filmData);
    console.log('GETTING TMDB FILM DETAILS BY ID:');
    filmData = filmData.slice(start, end);
    filmData = await getAllFilmDetails(filmData);
    console.log('DONE GETTING TMDB FILM DETAILS!');
    const browser = await puppeteer.launch({
        headless: true
    });
    console.log('FILTERING ONLY FOR FILMS WITH FULL DETAILS');
    filmData = filmData.filter(item => item != null && item != undefined && item);
    filmData = filmData.filter(item => item.id != null && item.id != undefined && item.id);
    console.log(filmData);
    console.log('GETTING LETTERBOXD RATINGS');


    //SPLITTING INTO MULTIPLE PROMISES.ALL
    let batchFraction = filmData.length / 100;
    let batchSize = Math.floor(filmData.length/batchFraction);
    console.log(`DIVIDING DATASET INTO ${batchFraction} BATCHES`);
    let batch;
    let finalData = [];

    for(var i = 1; i <= batchFraction; i++) {
        if(i == batchFraction) {
            console.log(`BATCH #${i} (films ${batchSize * (i-1)} to ${filmData.length}) STARTED `);
            batch = filmData.slice(batchSize * (i-1), filmData.length);
        } else {
            console.log(`BATCH #${i} (films ${batchSize * (i-1)} to ${batchSize * i}) STARTED `);
            batch = filmData.slice(batchSize * (i-1), batchSize * i);
        }
        
        await Promise.all(batch.map(async filmDetails => {
            let id = filmDetails.id;
            filmDetails['avg_letterboxd_rating'] = await getLetterboxdRating(id, browser).then(() => {
                if(id % idFrequencyLog == 0) {
                    console.log(id);
                }
            });
        })).catch(err => console.log(err));
        console.log(`TOTAL DATA SIZE AS OF NEW BATCH: ${finalData.length}`);
        finalData = finalData.concat(batch);
        console.log(`FINISHED BATCH #${i}`);
    }
    /*
    await Promise.all(filmData.map(async filmDetails => {
        let id = filmDetails.id;
        if(id % idFrequencyLog == 0) {
            console.log(id);
        }
        filmDetails['avg_letterboxd_rating'] = await getLetterboxdRating(id, browser);
    }))
    */
    //console.log(filmData);
    console.log('FINAL DATA LENGTH: ',finalData.length);
    
    let allData = require('./fullMovieDatabase.json');
    allData = allData.concat(finalData);

    fs.writeFile('fullMovieDatabase.json', JSON.stringify(allData), (err) => {
        if(err) {
            throw(err);
        }
        console.log('full movie database created and saved at fullMovieDatabase.json');
    });
    
    /*
    fs.appendFile('fullMovieDatabase.json', JSON.stringify(allData), (err) => {
        if(err) {
            throw(err);
            console.log('this chunk of movies has been created and saved at fullMoveDatabase.json');
        }
    });
    */
    return console.log('all done!');
}

// READ HERE!!

//Here's what your run process should look like:

//If you haven't prepped the raw TMDB data from downloading the 'Daily Export' of all movies from TMDB
//then go to prepRawTMDBData.js, uncomment line 34, and in your terminal type `node prepRawTMDBData.js'

//If you have a proper JSON file of all the TMDB data from the above step
//then simply run getLetterboxdRatings(filmData) where filmData is the file of all the TMDB movies imported on line 3 of this file

getLetterboxdRatings(filmData);