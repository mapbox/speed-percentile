var test = require('tap').test;
var getCDF = require('../lib/cdf.js');
var PercentileInterpolator = require('../lib/percentile.js');

var histogram = {20: 1, 30: 3, 40: 2, 50: 5, 60: 3};

test('R5 cumsum', function(t) {
  var result = getCDF.cumsum(histogram, -0.5);
  t.equal(result.n, 14);

  t.equal(Object.keys(result.cumsum).length, 5);
  t.equal(result.cumsum[20], 0.5);
  t.equal(result.cumsum[30], 2.5);
  t.equal(result.cumsum[40], 5);
  t.equal(result.cumsum[50], 8.5);
  t.equal(result.cumsum[60], 12.5);

  t.end();
});

test('R5 cdf and icdf', function(t) {
  var r = getCDF.cumsum(histogram, -0.5);
  var result = getCDF.cumdist(r.cumsum, r.n);

  t.equal(Object.keys(result.cdf).length, 6);
  t.equal(result.cdf[20], 0);
  t.equal(result.cdf[30], 2.5 / 14);
  t.equal(result.cdf[40], 5 / 14);
  t.equal(result.cdf[50], 8.5 / 14);
  t.equal(result.cdf[60], 12.5 / 14);
  t.equal(result.cdf[64], 1);

  t.equal(Object.keys(result.icdf).length, 7);
  t.equal(result.icdf[0], 20);
  t.equal(result.icdf[Math.round(2.5 / 14 * 1e6)], 30);
  t.equal(result.icdf[Math.round(5 / 14 * 1e6)], 40);
  t.equal(result.icdf[Math.round(8.5 / 14 * 1e6)], 50);
  t.equal(result.icdf[Math.round(12.5 / 14 * 1e6)], 60);
  t.equal(result.icdf[1e6], 64);

  t.end();
});

test('searchFromHigh vs. searchFromLow', function(t) {
  var pi = new PercentileInterpolator(histogram);


  var ps = [0.95];
  t.deepEqual(pi._searchFromHigh('icdf', ps), pi._searchFromLow('icdf', ps));

  ps = [0.05];
  t.deepEqual(pi._searchFromHigh('icdf', ps), pi._searchFromLow('icdf', ps));

  ps = [1, 0.4, 0.3, 0.5, 0];
  var hiSpeeds = pi._searchFromHigh('icdf', ps);
  var loSpeeds = pi._searchFromLow('icdf', ps)
                   .sort(function(a, b) { return b - a; });
  t.deepEqual(hiSpeeds, loSpeeds);


  var speeds = [23];
  t.deepEqual(pi._searchFromHigh('cdf', speeds), pi._searchFromLow('cdf', speeds));

  speeds = [61];
  t.deepEqual(pi._searchFromHigh('cdf', speeds), pi._searchFromLow('cdf', speeds));

  speeds = [20, 25, 35, 45, 55, 64];
  var hiPercentiles = pi._searchFromHigh('cdf', speeds);
  var loPercentiles = pi._searchFromLow('cdf', speeds)
                        .sort(function(a, b) { return b - a; });
  t.deepEqual(hiPercentiles, loPercentiles);

  t.end();
});


test('R5 percentile', function(t) {
  var pi = new PercentileInterpolator(histogram);

  var ps = [0.5, 0.7];  // test Array format
  var p = 0.95;         // test Number format

  var speeds = pi.getSpeed(ps);
  t.equal(speeds.length, 2);
  t.equal(speeds[0].toFixed(2), (50 + 10 * 1.3 / 4).toFixed(2));
  t.equal(speeds[1].toFixed(2), (40 + 10 * 2 / 3.5).toFixed(2));

  var speed = pi.getSpeed(p);
  var expected = (60 + (64 - 60) / (1 - 0.892857) * (0.95 - 0.892857)).toFixed(2);
  t.equal(speed.toFixed(2), expected);

  speeds = [56, 62];
  speed = 21;

  ps = pi.getPercentile(speeds);   // in descending order
  t.equal(ps.length, 2);
  expected = (0.8928571428571429 + (1 - 0.8928571428571429) / 4 * 2).toFixed(2);
  t.equal(ps[0].toFixed(2), expected);
  expected = (0.6071428571428571 + (0.8928571428571429 - 0.6071428571428571) / 10 * 6).toFixed(2);
  t.equal(ps[1].toFixed(2), expected);

  p = pi.getPercentile(speed);
  t.equal(p.toFixed(2), (0.17857142857142858 / 10 * 1).toFixed(2));

  t.end();
});
