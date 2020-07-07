const axios = require('axios');

function getFilms(username) {
    const data_url = username + '/films';

    axios.get(data_url)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.log(error);
        });
};

module.exports = getFilms;