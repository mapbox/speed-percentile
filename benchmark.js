var PercentileInterpolator = require('./lib/percentile');
var Benchmark = require('benchmark');
var fs = require('fs');
var path = require('path');

var infile = path.join(__dirname, '/test/simulate_100000/normal');
var testData = JSON.parse(fs.readFileSync(infile));
var pi = new PercentileInterpolator(testData);


var suite = new Benchmark.Suite('speed-percentile');

suite.add('speed-percentile#getSpeed', function() {
  pi.getSpeed(0.7);
});

suite.add('speed-percentile#getPercentile', function() {
  pi.getPercentile(45);
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {

})
.run();
