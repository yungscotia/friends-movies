const express = require('express');
const cors = require('cors');
const pino = require('express-pino-logger')();
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');


const app = express();
const port = 8080;

let filmsData = [];

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

app.get('/:username', (req, res, next) => {
    const username = req.params.username;
    const data_url = "https://letterboxd.com/" + username + '/films';
    fetch(data_url)
        .then(response => response.text())
        .then(function(data) {
           let $ = cheerio.load(data);
           let films = $('.poster-list li');
           films.each(function(element) {
                filmsData.push($(this).children().attr('data-film-slug'));
           });
           console.log('here are the number of films:', filmsData.length);
           return filmsData; 
        })
        .then(text => res.status(200).send(text))
        .then(() => filmsData = []);
        /*console.log(response.text());
            let $ = cheerio.load(response.text());
            let films = $('ul').children().length;
            console.log('here are the films length', films); */


        /*.then(function(text) {
            res.status(200).json({
                "data": text
        })});*/
});

