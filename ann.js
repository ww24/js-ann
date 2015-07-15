/**
 * Artificial Neural Network
 *
 */

function ANN(options) {
  var input_size = this._input_size = options.input_size;
  var middle_size = options.middle_size;
  var output_size = options.output_size;

  var i, j;

  this.middles = [];
  for (i = 0; i < middle_size; i++) {
    this.middles[i] = {
      weights: [],
      threshold: Math.random()
    };
    for (j = 0; j < input_size; j++) {
      this.middles[i].weights[j] = Math.random();
    }
  }

  this.outputs = [];
  for (i = 0; i < output_size; i++) {
    this.outputs[i] = {
      weights: [],
      threshold: Math.random()
    };
    for (j = 0; j < middle_size; j++) {
      this.outputs[i].weights[j] = Math.random();
    }
  }
}

ANN.sigmoid = function (u) {
  return 1 / (1 + Math.exp(-u));
};

ANN.prototype.exec = function (inputs) {
  return this.input(inputs).outputs;
};

ANN.prototype.input = function (inputs) {
  inputs = inputs.slice(0, this._input_size);

  var middles = this.middles.map(function (middle) {
    var value = inputs.map(function (input, index) {
      return input * middle.weights[index];
    }).reduce(function (a, b) {
      return a + b;
    });

    return ANN.sigmoid(value);
  });

  var outputs = this.outputs.map(function (output) {
    var value = middles.map(function (value, index) {
      return value * output.weights[index];
    }).reduce(function (a, b) {
      return a + b;
    });

    return ANN.sigmoid(value);
  });

  return {
    middles: middles,
    outputs: outputs
  };
};

// eta は学習定数 (0~1)
ANN.prototype.learn = function (eta, inputs, instructions) {
  var that = this;

  var result = this.input(inputs);

  var outputs = result.outputs.map(function (output, index) {
    var weights = that.outputs[index].weights;
    var epsilon = (output - instructions[index]) * output * (1 - output);
    // add  threshold
    weights.push(that.outputs[index].threshold);
    weights = weights.map(function (weight, index) {
      var delta = - eta * epsilon * result.middles[index];
      return weight + delta;
    });
    // get threshold
    weights.pop();
    that.outputs[index].weights = weights;
    return {
      weights: weights,
      epsilon: epsilon
    };
  });

  result.middles.forEach(function (middle, index) {
    var weights = that.middles[index].weights;
    var epsilon = outputs.map(function (output) {
      return output.epsilon * output.weights[index];
    }).reduce(function (a, b) {
      return a + b;
    }) * middle * (1 - middle);
    // add  threshold
    weights.push(that.middles[index].threshold);
    weights = weights.map(function (weight, index) {
      var delta = - eta * epsilon * inputs[index];
      return weight + delta;
    });
    // get threshold
    weights.pop();
    that.middles[index].weights = weights;
  });

  return result.outputs;
};

module && (module.exports = ANN);
