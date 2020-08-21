const fs = require('fs');

function makeGenreMap() {
    let genres = new Map();
    let genre_names = ['action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'mystery', 'romance', 'scifi', 'tv', 'thriller', 'war', 'western'];
    let genreIDs = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];

    for(var x = 0; x < genre_names.length; x++) {
        genres.set(genreIDs[x], genre_names[x]);
    }

    return genres;
};

function prepGenreData(film, genreMap) {
    for(let value of genreMap.values()) {
        film[value] = 0;
    }
    for(var x = 0; x < film.genres.length; x++) {
        film[genreMap.get(film.genres[x].id)] = 1;
    }

    return film;
}

function prepDataForModel(data, genreMap) {
    data = data.filter(item => item.user_rating != undefined || item.user_rating != null);
    
    inputs = data.map(film => {
        return prepGenreData(film, genreMap);
    }).map(film => {
        return [parseFloat(film.release_date.slice(0, 4)), film.popularity, film.vote_count, film.vote_average, film.action, film.adventure, film.animation, film.comedy, film.crime, film.documentary, film.drama, film.family, film.fantasy, film.history, film.horror, film.music, film.mystery, film.romance, film.scifi, film.tv, film.thriller, film.war, film.western];
    }).map(item => {
        return item.map(datapoint => parseFloat(datapoint));
    });

    outputs = data.map(film => {
        return film.avg_letterboxd_rating;
    })

    fs.writeFile('DatabaseInputs.json', inputs, (err) => {
        if(err) {
            throw(err)
        }
        console.log("Prepped Inputs for entire movie database saved at DatabaseInputs.json")
    });

    fs.writeFile('DatabaseOutputs.json', outputs, (err) => {
        if(err) {
            throw(err)
        }
        console.log("Prepped Outputs for entire movie database saved at DatabaseOutputs.json")
    });

    return {
        inputs: inputs,
        outputs: outputs
    };
}

//After getting film details for entire movie database in file getFilmDetailsByTMDBID.js
//uncomment and run this code to generate the data for the model input and outputs to train data


//const data = require('./fullMovieDatabase.json');
//let genreMap = makeGenreMap();
//prepDataForModel(data, genreMap);

