const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

function parseRating(rating) {
    if(!rating || rating.length == 0) {
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

function createTMDB_API_URL(title, year) {
    const APIkey = '20fbcd49dc115cbc2807646f1aa53b83';
    const APIquery = encodeURI(title);
    const APIyear = encodeURI(year);
    const url = 'https://api.themoviedb.org/3/search/movie?' + 'api_key=' + APIkey + '&query=' + APIquery + '&primary_release_year=' + APIyear;
    return url;
}

async function hasPagination(page, element) {
    let item = await page.evaluate(() => document.querySelector('div.paginate-pages'));
    if(item == null) {
        return false;
    } else {
        return true;
    }
}

async function getFilmDetails(API_url) {
    const details = await fetch(API_url)
        .then(response => response.json())
        .then(json => {
            const data = Array.from(json.results);
            if(data.length > 0) {
                var index = 0;
                var maxPopularity = 0;
                for(var x = 0; x < data.length; x++) {
                    if(maxPopularity < data[x].popularity) {
                        index = x;
                        maxPopularity = data[x].popularity;
                    }
                }
                return data[index];
            } else {
                return 'could not get film details';
            }
        }).catch(err => console.log(err));
    return details;
}

async function getFilmDataOnPage(page) {
    const TMDBkey = '20fbcd49dc115cbc2807646f1aa53b83';
    let filmData =  await page.evaluate(function() {
        return Array.from(document.querySelectorAll('li.poster-container'))
            .map(item => ({
                title: item.querySelector('div').getAttribute('data-film-name'),
                year: item.querySelector('div').getAttribute('data-film-release-year'),
                poster: item.querySelector('div').querySelector('img').src,
                link: item.querySelector('div').getAttribute('data-target-link'),
                user_rating: item.innerText
            }))
    });

    await Promise.all(filmData.map(async item => {  
        const API_url = createTMDB_API_URL(item['title'], item['year']);    
        const details = await getFilmDetails(API_url);
        let temp = parseRating(item.user_rating);
        item.user_rating = temp;
        item['details'] = details;
    }));

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
        } else {
            numPages = pages.length;
        }
        filmPages = [];
        for(var i = 2; i < numPages; i++) {
            let page_url = url + '/page/' + i + '/';
            await page.goto(page_url);
            filmPages.push(getFilmDataOnPage(page));
        }
        await Promise.all(filmPages).then(response => {
            response.forEach(page => {
                page.forEach(film => {
                    filmData.push(film);
                })
            })
        });
        /*
        for(var i = 2; i <= numPages; i++) {
            let page_url = url + '/page/' + i + '/';
            await page.goto(page_url);
            let pageData = await getFilmDataOnPage(page);
            for(var x = 0; x < pageData.length; x++) {
                filmData.push(pageData[x]);
            }
        }
        */
    }
    return filmData;
}

module.exports = {getData};
