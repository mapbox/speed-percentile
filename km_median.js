'use strict';

var CDF = require('./cdf.js');

function kmMedian(histogram) {

  var speeds = Object.keys(histogram);
  if (speeds.length < 0) {
    return NaN;
  }


  var cdf = CDF.kmCDF(histogram, 0.5).cdf;

  var speeds = Object.keys(cdf);
  if (speeds.length === 1) return +speeds[0];

  var l = +speeds[speeds.length-2];
  var r = +speeds[speeds.length-1];
  return l + (r - l) * (0.5 - cdf[l]) / (cdf[r] - cdf[l]);
}

module.exports = kmMedian;
