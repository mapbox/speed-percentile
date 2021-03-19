var test = require('tap').test;
var PercentileInterpolator = require('../lib/percentile.js');

test('R5 percentile {25.0: 8, 28.0: 6, 37.0: 4, 57.0: 4, 59.0: 4, 76.0: 3}', function(t) {
  var histogram = {25.0: 8, 28.0: 6, 37.0: 4, 57.0: 4, 59.0: 4, 76.0: 3};
  var pi = new PercentileInterpolator(histogram);

  var speeds = [22.26, 32.26];

  var ps = pi.getPercentile(speeds);   // in descending order
  t.equal(ps.length, 2);
  t.equal(Number(ps[0].toFixed(2)), 0.63);
  t.equal(Number(ps[1].toFixed(2)), 0.55);

  t.end();
});

test('R5 percentile {9.0: 3, 5.0: 1, 3.0: 3}', function(t) {
  var histogram = {9.0: 3, 5.0: 1, 3.0: 3};
  var pi = new PercentileInterpolator(histogram);

  var speeds = [8.74, -1.26];

  var ps = pi.getPercentile(speeds);   // in descending order
  t.equal(ps.length, 2);
  t.equal(Number(ps[0].toFixed(2)), 0.77);
  t.equal(Number(ps[1].toFixed(2)), 0.05);

  t.end();
});
