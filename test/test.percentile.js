var test = require('tap').test;
var CDF = require('../cdf');
var percentile = require('../percentile');

/**
 * See wiki for where these numbers come from.
 */

var histogram = {20: 1, 30: 3, 40:2, 50: 5, 60: 3};

test('R4 cumsum', function(t) {
  var result = CDF.cumsum(histogram);
  t.equal(result.n, 14);

  t.equal(result.cumsum[20], 1);
  t.equal(result.cumsum[30], 4);
  t.equal(result.cumsum[40], 6);
  t.equal(result.cumsum[50], 11);
  t.equal(result.cumsum[60], 14);
  t.end();
});


test('R5 cumsum', function(t) {
  var result = CDF.cumsum(histogram, -0.5);
  t.equal(result.n, 14);

  t.equal(result.cumsum[20], 0.5);
  t.equal(result.cumsum[30], 2.5);
  t.equal(result.cumsum[40], 5);
  t.equal(result.cumsum[50], 8.5);
  t.equal(result.cumsum[60], 12.5);
  t.end();
});


test('R4 cdf', function(t) {
  var cdf = CDF(histogram);
  t.equal(cdf[20], 1/14);
  t.equal(cdf[30], 4/14);
  t.equal(cdf[40], 6/14);
  t.equal(cdf[50], 11/14);
  t.equal(cdf[60], 14/14);
  t.end();
});

test('R5 cdf', function(t) {
  var cdf = CDF(histogram, -0.5);
  t.equal(cdf[20], 0.5/14);
  t.equal(cdf[30], 2.5/14);
  t.equal(cdf[40], 5/14);
  t.equal(cdf[50], 8.5/14);
  t.equal(cdf[60], 12.5/14);
  t.end();
});


var ps = [0.5, 0.7];  // test Array format
var p = 0.95;          // test Number format

test('R4 percentile', function(t) {
  // speeds always in descending order
  var speeds = percentile(histogram, ps, 'R4');
  t.equal(speeds.length, 2);
  t.equal(speeds[0].toFixed(4), (40 + 10 * 3.8 / 5).toFixed(4));
  t.equal(speeds[1].toFixed(4), (40 + 10 * 1 / 5).toFixed(4));

  var speed = percentile(histogram, p, 'R4');
  t.type(speed, 'number');
  t.equal(speed.toFixed(4), (50 + 10 * 2.3 / 3).toFixed(4));

  t.end();
});


test('R5 percentile', function(t) {
  var speeds = percentile(histogram, ps);
  t.equal(speeds.length, 2);
  t.equal(speeds[0].toFixed(4), (50 + 10 * 1.3 / 4).toFixed(4));
  t.equal(speeds[1].toFixed(4), (40 + 10 * 2 / 3.5).toFixed(4));

  var speed = percentile(histogram, p);
  t.equal(speed.toFixed(4), (60 + 10 * 0.8 / 4).toFixed(4));

  t.end();
});
