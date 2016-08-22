'use strict';
var getCDF = require('./cdf');

/**
 * find speed(s) corresponding to desired percentile(s)
 * @param  {object}         histogram   speed histogram
 * @param  {Number | Array} ps          percentiles of interest
 * @param  {String}         type        algorithm flag
 * @return {Number | Array}             corresponding speeds in descending order
 */
module.exports = function(histogram, ps, type) {

  // ensure ps is an array
  if (!Array.isArray(ps)) ps = [ps];

  // edge cases
  var speeds = Object.keys(histogram);
  if (speeds.length < 0) return NaN;
  else if (speeds.length === 1) {
    if (!Array.isArray(ps)) return +speeds[0];

    var percentileSpeeds = [];
    for (var i = 0; i < ps.length; i++) {
      percentileSpeeds.push(+speeds[0]);
    }
    return percentileSpeeds.length > 1 ? percentileSpeeds : percentileSpeeds[0];
  }


  // compute cumulative distribution function
  var cdf;
  switch (type) {
  case 'R4':
      // R4 with linear estimation of lower extreme
    cdf = getCDF(histogram);
    break;

  default:
    //R5 with linear estimation of both upper and lower extremes
    cdf = getCDF(histogram, -0.5);
  }

  // interpolate speeds
  percentileSpeeds = module.exports.piecewiseLinearInterpolation(cdf, ps);
  return percentileSpeeds.length > 1 ? percentileSpeeds : percentileSpeeds[0];
};


/**
 * piecewise linearly interpolate speeds from CDF
 * @param  {object} cdf   cumulative distribution function
 * @param  {Array}  ps    percentiles of interest
 * @return {Array}        corresponding speeds in descending order
 */
module.exports.piecewiseLinearInterpolation = function(cdf, ps) {

  // ensure ps is an array
  if (!Array.isArray(ps)) ps = [ps];

  // count number of percentiels above 50
  var aboveCount = ps.filter(function(x) { return x >= 0.5; }).length;
  var belowCount = ps.length - aboveCount;
  if (aboveCount >= belowCount) return module.exports.searchFromHigh(cdf, ps);
  else return module.exports.searchFromLow(cdf, ps)
                            .sort(function(a, b) { return b - a; });
};


module.exports.searchFromHigh = function(cdf, ps) {

  // sort percentiles in descending order
  ps.sort(function(a, b) { return b - a; });

  // linearly project a point beyond 1 for interpolating upper tail
  var speeds = Object.keys(cdf);
  var i = speeds.length - 1;
  var j = speeds.length - 2;
  var newspeed = 2 * speeds[i] - speeds[j];
  cdf[newspeed] = 2 * cdf[speeds[i]] - cdf[speeds[j]];

  var percentileSpeeds = [];
  speeds = Object.keys(cdf);
  i = speeds.length - 1;

  // loop through desired percentiles
  for (j = 0; j < ps.length; j++) {
    var p = ps[j];

    // linear search from high to low for interval to interpolate
    while (i > 0 && cdf[speeds[i]] >= p) i--;

    // interpolate speed
    var l = +speeds[i];
    var r = +speeds[i + 1];
    if (p <= cdf[speeds[i]]) {  // lower extreme
      var tmp = r; r = l; l = tmp;
    }

    percentileSpeeds.push(l + (r - l) * (p - cdf[l]) / (cdf[r] - cdf[l]));
  }

  return percentileSpeeds;
};

module.exports.searchFromLow = function(cdf, ps) {

  // sort percentiles in descending order
  ps.sort(function(a, b) { return a - b; });

  // linearly project a point beyond 0 for interpolating lower tail
  var speeds = Object.keys(cdf);
  var i = 0;
  var j = 1;
  var newspeed = 2 * speeds[i] - speeds[j];
  cdf[newspeed] = 2 * cdf[speeds[i]] - cdf[speeds[j]];

  var percentileSpeeds = [];
  speeds = Object.keys(cdf);
  i = 1;

  // loop through desired percentiles
  for (j = 0; j < ps.length; j++) {
    var p = ps[j];

    // linear search from high to low for interval to interpolate
    while (i < speeds.length && cdf[speeds[i]] <= p) i++;

    // interpolate speed
    var l = +speeds[i - 1];
    var r = +speeds[i];
    if (p >= cdf[speeds[i]]) {  // upper extreme
      var tmp = r; r = l; l = tmp;
    }

    percentileSpeeds.push(l + (r - l) * (p - cdf[l]) / (cdf[r] - cdf[l]));
  }

  return percentileSpeeds;
};
