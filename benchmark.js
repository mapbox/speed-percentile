var buffer = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var algorithms = ['km', 'R4', 'R5'];
var testData = JSON.parse(fs.readFileSync(__dirname +
                                        '/test/simulate_100000/normal'));

var suite2 = new Benchmark.Suite('km-median');
suite2.add('km-median', function () {
  buffer(testData);
}).on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {

})
.run();


var suite = new Benchmark.Suite('speed-percentile');

algorithms.forEach(function (flag) {
  suite.add('speed-percentile#' + flag, function () {
    var p = flag === 'km' ? 0.5 : 0.7;
    buffer(testData, p, flag);
  });
});

suite.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {

})
.run();
