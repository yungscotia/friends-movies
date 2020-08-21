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
    for(let value of Array.from(genreMap.values())) {
        film[value] = 0;
    }
    for(var x = 0; x < film.genres.length; x++) {
        film[genreMap.get(film.genres[x].id)] = 1;
    }
    return film;
}

function prepDataForModel(data, genreMap) {
    data = data.filter(item => item.avg_letterboxd_rating != null);
    
    inputs = data.map(film => {
        return prepGenreData(film, genreMap);
    }).map(film => {
        return [film.release_date.slice(0, 4), film.popularity, film.vote_count, film.vote_average, film.action, film.adventure, film.animation, film.comedy, film.crime, film.documentary, film.drama, film.family, film.fantasy, film.history, film.horror, film.music, film.mystery, film.romance, film.scifi, film.tv, film.thriller, film.war, film.western];
    }).map(item => {
        return item.map(datapoint => parseFloat(datapoint));
    });

    outputs = data.map(film => {
        return film.avg_letterboxd_rating;
    })

    fs.writeFile('DatabaseInputs.json', JSON.stringify(inputs), (err) => {
        if(err) {
            throw(err)
        }
        console.log("Prepped Inputs for entire movie database saved at DatabaseInputs")
    });

    fs.writeFile('DatabaseOutputs.json', JSON.stringify(outputs), (err) => {
        if(err) {
            throw(err)
        }
        console.log("Prepped Outputs for entire movie database saved at DatabaseOutputs")
    });

    return {
        inputs: inputs,
        outputs: outputs
    };
}

function validateData(inputs, outputs) {
    console.log('validating inputs......');
    let length = inputs[0].length;
    sameLength = true;
    for(var x = 0; x < inputs.length; x++) {
        if(length != inputs[x].length) {
            sameLength = false;
            console.log(`${inputs[x]} at index ${x} does not have a proper length`);
        }
    }
    if(sameLength == true) {
        console.log('all inputs have same length');
    } else {
        console.log('OH NO INPUTS HAVE DIFFERENT LENGTHS');
    }

    console.log('validating outputs');
    let allFloatsBelow5 = true;
    for(var y = 0; y < outputs.length; y++) {
        if((typeof outputs[y]) != 'number' || outputs[y] >= 5) {
            allFloatsBelow5 = false;
            console.log(`${outputs[y]} at index ${y} is not right`);
        }
    }
    if(allFloatsBelow5) {
        console.log('all outputs less than 5 and are type number');
    } else {
        console.log('OH NO OUTPUTS HAVE SOMETHING WRONG');
    }

    if(outputs.length == inputs.length) {
        console.log('both inputs and outputs have same number of data points');
    } else {
        console.log('INPUTS AND OUTPUTS DO NOT HAVE SAME NUMBER OF DATA POINTS');
    }

    return;
}

//After getting film details for entire movie database in file getFilmDetailsByTMDBID.js
//uncomment and run this code to generate the data for the model input and outputs to train data


const data = require('./fullMovieDatabase.json');
let genreMap = makeGenreMap();
let preppedData = prepDataForModel(data, genreMap);
validateData(preppedData.inputs, preppedData.outputs);

