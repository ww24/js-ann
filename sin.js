/**
 * 人工ニューラルネットワークで sin 関数を学習する。
 *
 */

var ANN = require("./ann");
var file = require("./fileout");

// var ann = new ANN({
//   input_size: 2,
//   middle_size: 2,
//   output_size: 1
// });

// ann.middles[0].weights[0] = -2;
// ann.middles[0].weights[1] = -1;
// ann.middles[1].weights[0] = 1;
// ann.middles[1].weights[1] = 2;
// ann.outputs[0].weights[0] = 1;
// ann.outputs[0].weights[1] = 0;

// ann.middles[0].threshold = ann.middles[1].threshold = ann.outputs[0].threshold = 0;

// var res = ann.learn(0.1, [0, 1], [0]);
// res = ann.input([0, 1]);

// console.log(res);

var ann = new ANN({
  input_size: 1,
  middle_size: 10,
  output_size: 1
});

var eta = 0.001;

var time = Date.now();
var i = 0;

process.on("SIGINT", printResult);
function printResult() {
  console.log("== results ==");
  console.log(i + " times");
  console.log("time:", Date.now() - time, "msec");
  console.log("middles:", ann.middles);
  console.log("outputs:", ann.outputs);
  process.exit(0);
}

(function loop() {
  var x = Math.random() * Math.PI * 2 - Math.PI;
  var res = ann.learn(eta, [x], [Math.sin(x)]);

  if (i % 100000 === 99999) {
    console.log(i + 1, "周目");
    x = 1;
    console.log("x:", x, ", ann:", ann.exec([x])[0], ", sin:", Math.sin(x));
    x = 0;
    console.log("x:", x, ", ann:", ann.exec([x])[0], ", sin:", Math.sin(x));

    var j, results = ["x,ann,sin"];
    for (x = 0, j = 0; x < Math.PI; x += 0.01, j++) {
      res = ann.learn(eta, [x], [Math.sin(x)]);
      results[j + 1] = [x, res[0], Math.sin(x)].join(",");
    }
    file.write("results/" + (i + 1) + ".csv", results.join("\n"));
    // if (results.every(function (t) {return t})) {
    //   printResult();
    // }
  }

  // next roop
  i++;
  setImmediate(loop);
})();
