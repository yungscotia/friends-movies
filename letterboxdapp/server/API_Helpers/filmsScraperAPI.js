const axios = require('axios');
const cheerio = require('cheerio');

async function getFilms(username) {
    const data_url = "https://letterboxd.com/" + username + '/films';

    let data = await axios.get(data_url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });
    
    return data;
};

module.exports = getFilms;