const tf = require('@tensorflow/tfjs');
const yungscotia = require('../../yungscotia.json');

let data1 = [];
let output1 = [];

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


