const tf= require('@tensorflow/tfjs');
const yungscotia = require('../../yungscotia.json');

let data1 = [];
let output1 = [];

for(var x = 0; x < 100; x++) {
    if(yungscotia[x].user_rating != null) {
        output1.push(parseFloat(yungscotia[x].user_rating));
        data1.push(parseFloat(yungscotia[x].year));
    }
}

console.log(data1);
console.log(output1);

async function buildModel(data, output) {
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    // Generate some synthetic data for training.
    const xs = tf.tensor2d(data, [data.length, 1]);
    const ys = tf.tensor2d(output, [output.length, 1]);
    // Train the model using the data then do inference on a data point the
    // model hasn't seen:
    await model.fit(xs, ys, {epochs: 5});
    
    model.predict(tf.tensor2d([2020], [1, 1])).print();

}

buildModel(data1, output1);



