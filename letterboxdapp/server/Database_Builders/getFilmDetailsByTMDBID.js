const fetch = require('isomorphic-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs');
let filmData = require('./allTMDBMovies.json');
filmData = filmData.slice(11, 22);

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
    return fetch(APIurl).then(response => response.json());
}

function prepTMDBMoviesData(filmData) {
    filmData = filmData.map(item => {
        return item.id;
    })
    return filmData; //This returns an array of all movie IDs only -> helpful for converting the TMDB Daily Export JSON data to just TMDB IDs
}

async function getAllFilmDetails(filmData) { //This is where the magic happens!
    return Promise.all(filmData.map(async filmID => {
        return getFilmDetailsByID(filmID);
    }))
}

async function getLetterboxdRating(id, browser) {
    let letterboxd_url = createLetterboxdLink(id);
    const page = await browser.newPage();
    await page.goto(letterboxd_url, {waitUntil: 'networkidle2'});
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
    filmData = prepTMDBMoviesData(filmData);
    filmData = await getAllFilmDetails(filmData);
    const browser = await puppeteer.launch({
        headless: true
    });
    await Promise.all(filmData.map(async filmDetails => {
        let id = filmDetails.id;
        console.log(id);
        filmDetails['avg_letterboxd_rating'] = await getLetterboxdRating(id, browser);
    }))
    console.log(filmData);
    fs.writeFile('fullMovieDatabase.json', JSON.stringify(filmData), (err) => {
        if(err) {
            throw(err);
        }
        console.log('full movie database created and saved at fullMovieDatabase.json');
    })
    await browser.close();
    return console.log('all done!');
}

// READ HERE!!

//Here's what your run process should look like:

//If you haven't prepped the raw TMDB data from downloading the 'Daily Export' of all movies from TMDB
//then go to prepRawTMDBData.js, uncomment line 34, and in your terminal type `node prepRawTMDBData.js'

//If you have a proper JSON file of all the TMDB data from the above step
//then simply run getLetterboxdRatings(filmData) where filmData is the file of all the TMDB movies imported on line 3 of this file

getLetterboxdRatings(filmData);