var buffer = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var algorithms = ['R4', 'R5'];
var p = 0.7;
var infile = __dirname + '/test/simulate_100000/normal';
var testData = JSON.parse(fs.readFileSync(infile));

var suite = new Benchmark.Suite('speed-percentile');

algorithms.forEach(function (flag) {
  suite.add('speed-percentile#' + flag, function () {
    buffer(testData, p, flag);
  });
});

suite.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {

})
.run();
