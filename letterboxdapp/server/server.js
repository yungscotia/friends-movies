const reqHandler = require('./API_Helpers/filmDataHandlers.js');
const express = require('express');
const cors = require('cors');
const pino = require('express-pino-logger')();
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const datafile = require('../yungscotia.json');


const app = express();
const port = 8080;

app.listen(port, function() {
    console.log('server started up at', port);
})

app.use(cors());
app.use(pino);

/*
app.get('/runmodel', async (req, res, next) => {
    let recommendations = buildModel();
    res.send(recommendations);
});
*/

app.get('/:username', async (req, res, next) => {
    let username = req.params.username;
    const data_url = "https://letterboxd.com/" + username + '/films';
    let filmData = await reqHandler.getData(data_url);
    let writeData = JSON.stringify(filmData);
    fs.writeFile(username + '.json', writeData, (err) => {
        if(err) {
            throw(err);
        }
        console.log("JSON data saved to", username+'.json');
    });
    res.json(filmData);
});


app.get('/test/:username', async (req, res, next) => {
    let username = req.params.username;
    const data_url = "https://letterboxd.com/" + username + '/films';
    let filmData = await reqHandler.getData(data_url);
    res.json(filmData);
});


app.get('/film/:filmname', async (req, res, next) => {
    let filmname = req.params.filmname;
    const data_url = "https://letterboxd.com/film/" + filmname;
    let filmData = await fetch(data_url)
        .then(response => response.text())
        .then(function(data) {
            let $ = cheerio.load(data);
            let id = $('body').attr('data-tmdb-id');
            console.log(id);
            return id;
        });
    res.send(filmData);
});


/*
app.get('/twitter/:searchterm', async (req, res, next) => {
    let searchTerm = req.params.searchterm;
    let data_url = 'https://stream.twitter.com/1.1/statuses/filter.json?track=' + searchTerm;

    let twitterData = await fetch(data_url)
        .then(response => response.text())
        .then(function(data) {
            return data;
        })
    res.send(twitterData);
});
*/
