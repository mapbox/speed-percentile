var buffer = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var p = 0.85;
var algorithms = ['km', 'R4', 'R5'];
var testData = JSON.parse(fs.readFileSync(__dirname +
                                        '/test/simulate_100000/normal'));

var suite = new Benchmark.Suite('speed-percentile');

algorithms.forEach(function (flag) {
  suite.add('speed-percentile#' + flag, function () {
    buffer(testData, p, flag);
  })
});

suite.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {

})
.run();