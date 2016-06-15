'use strict';

var CDF = require('./cdf.js');

function kmMedian(histogram) {

  if (Object.keys(histogram).length < 0) return NaN;

  var cdf = CDF.kmCDF(histogram, 0.5).cdf;

  var speeds = Object.keys(cdf);
  var l = +speeds[speeds.length-2];
  var r = +speeds[speeds.length-1];
  return l + (r - l) * (0.5 - cdf[l]) / (cdf[r] - cdf[l]);
}

module.exports = kmMedian;
