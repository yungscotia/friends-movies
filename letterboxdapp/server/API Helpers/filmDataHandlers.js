const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

function parseRating(rating) {
    if(rating.length == 0) {
        return null;
    } else {
        let count = 0;
        for(var i = 0; i < rating.length; i++) {
            if(rating[i] == '★') {
                count += 1;
            } else if(rating[i] == '½') {
                count += .5;
            }
        }
        return count;
    }
}

async function hasPagination(page, element) {
    let item = await page.evaluate(() => document.querySelector('div.paginate-pages'));
    if(item == null) {
        return false;
    } else {
        return true;
    }
}

async function getFilmDataOnPage(page) {
    let filmData =  await page.evaluate(function() {
        return Array.from(document.querySelectorAll('li.poster-container'))
            .map(item => ({
                title: item.querySelector('div').getAttribute('data-film-name'),
                poster: item.querySelector('div').querySelector('img').src,
                link: item.querySelector('div').getAttribute('data-target-link'),
                rating: item.innerText
            }))
    });
    for(var i = 0; i < filmData.length; i++) {
        filmData[i]['rating'] = parseRating(filmData[i]['rating']);
    }

    return filmData;
}

async function getData(url) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'}); //wait till dynamic data has rendered

    let filmData = await getFilmDataOnPage(page); //get first page's film data
    let numPages = 1;
    if(await hasPagination(page)) {
        let pages = await page.evaluate(() => Array.from(document.querySelectorAll('div.paginate-pages li'))
            .map(item => item.innerText));
        if(pages.length > 4) {
            numPages = pages[4];
            console.log(numPages);
        } else {
            numPages = pages.length;
            console.log(numPages);
        }
        for(var i = 2; i <= numPages; i++) {
            let page_url = url + '/page/' + i + '/';
            await page.goto(page_url);
            let pageData = await getFilmDataOnPage(page);
            for(var x = 0; x < pageData.length; x++) {
                filmData.push(pageData[x]);
            }
        }
    }
    console.log(filmData.length);
    return filmData;
}

async function getDetails(url) {
    let tmdbID = await fetch(url)
        .then(response => response.text())
        .then(function(data) {
            let $ = cheerio.load(data);
            return $('body').attr('data-tmdb-id'); //tmdb ID
        });
    let apiURL = "https://api.themoviedb.org/3/movie/" + tmdbID + "?api_key=20fbcd49dc115cbc2807646f1aa53b83&language=en-US"
    let filmDetails = await fetch(apiURL)
        .then(response => response.json())
        .then(function(data) {
            return {
                id : data["id"],
                title : data["original_title"],
                poster : "https://image.tmdb.org/t/p/w500/" + data["poster_path"],
                date : data["release_date"]
            };
        });
    return filmDetails;
}

async function parseFilms(data) {
    let filmsData = [];
    let $ = cheerio.load(data);
    let films = $('.poster-list li');
    for(var i = 0; i < films.length; i ++) {
        let element = films.eq(i);
        let letterboxdLink = "https://letterboxd.com" + element.children().attr('data-film-slug');
        let details = await getDetails(letterboxdLink);
        filmsData.push(
            {
                film: details["title"],
                date: details["date"],
                link: letterboxdLink,
                poster: details["poster"],
                count: i
            }
        );
    }
    /*
    films.map(async function(element) {
        let letterboxdLink = "https://letterboxd.com" + $(this).children().attr('data-film-slug');
        let id = await fetch(letterboxdLink)
            .then(response => response.text())
            .then(function(temp) {
                return "id test"
            })
        filmsData.push({
            link: letterboxdLink,
            count: count,
            id: id
        })
        //let details = await getDetails(letterboxdLink);
        /*
        filmsData.push(
            {
                film: details["title"],
                date: details["date"],
                link: letterboxdLink,
                poster: details["poster"],
                count: count
            }
        );
        
        count++;
    });
    */

    //console.log('here are the number of films:', filmsData);
    return filmsData;
};

async function getFilms(username) {
    const data_url = "https://letterboxd.com/" + username + '/films';
    let allFilms = await fetch(data_url)
        .then(response => response.text())
        .then(async function(data) {
            let $ = cheerio.load(data);
            let filmData = await parseFilms(data);
            if($('div').hasClass('pagination')) {
                console.log('HAS PAGINATION');
                let numPages = parseInt($('.paginate-pages').children().children().last().text());
                for(var x = 2; x <= numPages; x++) {
                    let page_url = data_url + '/page/' + x + '/';
                    console.log(page_url);
                    let tempData = await fetch(page_url)
                        .then(response => response.text())
                        .then(async function(raw) {
                            return await parseFilms(raw);
                        });
                    for(var i = 0; i < tempData.length; i++) {
                        filmData.push(tempData[i]);
                    }
                }
            } 
            return filmData;
        });
    return allFilms;
}

module.exports = {parseFilms, getFilms, getData};
