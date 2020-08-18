const tf = require('@tensorflow/tfjs');
//const yungscotia = require('../../yungscotia.json');

let data1 = [];
let output1 = [];
//console.log(yungscotia[0].details.genre_ids);

let genre_names = ['action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'mystery', 'romance', 'scifi', 'tv', 'thriller', 'war', 'western'];
let genreIDs = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
let genres = new Map();

if(genre_names.length != genreIDs.length) {
    console.log('ARRAYS NOT EQUAL LENGTH');
}

for(var x = 0; x < genre_names.length; x++) {
    genres.set(genreIDs[x], genre_names[x]);
}

function prepGenreData(element) {
    let element_genres = element.details.genre_ids;
    for(var i = 0; i < genre_names.length; i++) {
        element[genre_names[i]] = 0;
    }
    for(var x = 0; x < element_genres.length; x++) {
        let genre = genres.get(element_genres[x]);
        element[genre] = 1;
    }
    if(element.details.original_language == 'en') {
        element['en'] = 1;
    } else {
        element['en'] = 0;
    }
    return element;
} 



function prepData(username) {
    let rawData = require('../../' + username + '.json');
    
    let xs = rawData.filter(item => item.user_rating != null)
        .filter(element => element.details.popularity != undefined)
        .map(element => {
            element = prepGenreData(element);
            return element;
        })
        .map(item => {
            return [item.year, item.details.popularity, item.details.vote_count, item.details.vote_average, item.action, item.adventure, item.animation, item.comedy, item.crime, item.documentary, item.drama, item.family, item.fantasy, item.history, item.horror, item.music, item.mystery, item.romance, item.scifi, item.tv, item.thriller, item.war, item.western];
        })
        .map(item => {
            return item.map(datapoint => parseFloat(datapoint));
        });
    
    let ys = rawData.filter(item => item.user_rating != null)
        .map(element => {
            return [element.user_rating, element.details.popularity]
        })
        .filter(film => film[1] != undefined)
        .map(thing => {
            return parseFloat(thing[0]);
        });

    return {
        inputs: xs,
        outputs: ys
    };
}

function normalizeTensors(cleanData) {
    let xs = tf.tensor2d(cleanData.inputs, [cleanData.inputs.length, cleanData.inputs[0].length]);
    let ys = tf.tensor2d(cleanData.outputs, [cleanData.outputs.length, 1]);
    
    
    let xsMaxes = xs.max(0);
    let xsMins = xs.min(0);
    let ysMax = ys.max();
    let ysMin = ys.min();
    let normxs = xs.sub(xsMins).div(xsMaxes.sub(xsMins));
    let normys = ys.sub(ysMin).div(ysMax.sub(ysMin));
    normys.print();
    normxs.print();


    return {
        inputs: normxs,
        outputs: normys,
        xMax: xsMaxes,
        xMin: xsMins,
        yMax: ysMax,
        yMin: ysMin
    };
}

function denormalizeTensors(tensor, max, min) {
    return tensor.mul(max.sub(min)).add(min);
}

async function buildModel(data) {
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [23]}));
    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    

    // Generate some synthetic data for training.
    const xs = data.inputs;
    const ys = data.outputs;

    let testData = data.inputs.slice([0,0],[7, 23]);

    // Train the model using the data then do inference on a data point the
    // model hasn't seen:
    await model.fit(xs, ys, {epochs: 2000});

    let prediction = model.predict(testData);
    
    console.log('model prediction');
    denormalizeTensors(prediction, data.yMax, data.yMin).print();

    console.log('actual data');
    denormalizeTensors(data.outputs.slice([0,0], [7, 1]), data.yMax, data.yMin).print();

    return;
}

let cleanedData = prepData('santiweight');
let normalizedData = normalizeTensors(cleanedData);

buildModel(normalizedData);


/*
year
user_rating
popularity
vote_count
id
original_language
genre_ids
vote_average

/*
for(var x = 0; x < yungscotia.length; x++) {
    if(yungscotia[x].user_rating != null) {
        output1.push(parseFloat(yungscotia[x].user_rating));
        data1.push(parseFloat(yungscotia[x].year));
    }
}

console.log(data1);
console.log(output1);


async function cleanData(data, output) {
    let xs = tf.tensor2d(data, [data.length, 1]);
    let ys = tf.tensor2d(output, [output.length, 1]);
    const inputMax = xs.max();
    const inputMin = xs.min();
    const labelMax = ys.max();
    const labelMin = ys.min();
    const normalizedInputs = 
    xs.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels =
    ys.sub(labelMin).div(labelMax.sub(labelMin));
    console.log(await normalizedInputs.data());
    console.log(await normalizedLabels.data());
    return {
    inputs: normalizedInputs,
    labels: normalizedLabels,
    xmax: inputMax,
    xmin: inputMin,
    ymax: labelMax,
    ymin: labelMin,
    };
}


function deNormalize(tensor, xmax, xmin, ymax, ymin) {
    return tensor.mul(ymax.sub(ymin)).add(ymin);
};

async function buildModel(data, output) {
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    let cleanedData = await cleanData(data, output);

    // Generate some synthetic data for training.
    const xs = cleanedData.inputs;
    const ys = cleanedData.labels;


    // Train the model using the data then do inference on a data point the
    // model hasn't seen:
    await model.fit(xs, ys, {epochs: 2000});
    
    console.log(await xs.data());
    console.log(await ys.data());

    let testYear = (2019 - (await cleanedData.xmin.data())[0])/((await cleanedData.xmax.data())[0] - (await cleanedData.xmin.data())[0]);
    console.log((await cleanedData.xmin.data())[0]);
    console.log(testYear);

    let prediction = model.predict(tf.tensor2d([testYear], [1, 1]));
    let denormalizedPrediction = deNormalize(prediction, cleanedData.xmax, cleanedData.xmin, cleanedData.ymax, cleanedData.ymin);
    denormalizedPrediction.print();

}


async function testCase() {
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    // Generate some synthetic data for training.
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);
    // Train the model using the data then do inference on a data point the
    // model hasn't seen:
    await model.fit(xs, ys, {epochs: 5});
    model.predict(tf.tensor2d([5], [1, 1])).print();
}

//cleanData(data1, output1);
buildModel(data1, output1);
//testCase();
*/

