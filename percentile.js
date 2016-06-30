'use strict';

var CDF = require('./cdf.js');

function percentile(histogram, ps, type) {

  var speeds = Object.keys(histogram);
  if (speeds.length < 0) {
    return NaN;
  } else if (speeds.length === 1) {
    if (!Array.isArray(ps)) return +speeds[0];

    var quantiles = [];
    for (var i in ps) {
      quantiles.push(+speeds[0]);
    }
    return quantiles;
  } else if (type === 'km' && speeds.length === 2) {
    // km breaks down; default to R5
    type = 'R5';
  }


  var dist;
  switch (type) {
    case 'km':
      // Kaplan Meier freeflow
      dist = CDF.kmCDF(histogram);
      break;

    case 'R4':
      // R4 with linear estimation of lower extreme
      dist = CDF.R4CDF(histogram);
      break;

    default:
      //R5 with linear estimation of both upper and lower extremes
      dist = R5(histogram);
  }

  return piecewiseLinearInterpolation(dist.cdf, ps);
}


function piecewiseLinearInterpolation(cdf, ps, istart) {

  if (!Array.isArray(ps)) {
    ps = [ps];
  }

  ps.sort(function (a, b) { return b - a; });  // desc order

  var quantiles = [];
  var speeds = Object.keys(cdf);

  var i = istart === undefined ? speeds.length-1 : istart;

  ps.forEach(function (p) {
    while (i > 0 && cdf[speeds[i]] >= p) i--;

    var l = +speeds[i];
    var r = +speeds[i+1];
    if (p <= cdf[speeds[i]]) {  // lower extreme
      var tmp = r; r = l; l = tmp;
    }

    quantiles.push(l + (r - l) * (p - cdf[l]) / (cdf[r] - cdf[l]));
  });

  return quantiles.length > 1 ? quantiles : quantiles[0];

}


function R5(histogram) {

  var dist = CDF.R4CDF(histogram, -0.5);
  var cdf = dist.cdf;
  var n = dist.n;

  // add a linear projection point for upper extreme value
  var speeds = Object.keys(cdf);
  var i = speeds.length-1;
  var j = speeds.length-2;
  var newspeed = 2 * speeds[i] - speeds[j];
  cdf[newspeed] = 2 * cdf[speeds[i]] - cdf[speeds[j]];

  return {cdf: cdf, n: n};

}


module.exports = percentile;
