const reqHandler = require('./API Helpers/filmDataHandlers');
const express = require('express');
const cors = require('cors');
const pino = require('express-pino-logger')();
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');


const app = express();
const port = 8080;

app.listen(port, function() {
    console.log('server started up at', port);
})

app.use(cors());
app.use(pino);

app.get('/', (req, res, next) => {
    res.status(200).json({
        overview: "okay please work"
    });
});

app.get('/:username', async (req, res, next) => {
    let username = req.params.username;
    const data_url = "https://letterboxd.com/" + username + '/films';
    let filmData = await reqHandler.getData(data_url);
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
        })
    res.send(filmData);
})