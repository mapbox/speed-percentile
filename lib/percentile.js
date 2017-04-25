'use strict';

var getCDF = require('./cdf');

module.exports = PercentileInterpolator;

/**
 * find speed(s) corresponding to desired percentile(s)
 * @param  {object}         histogram   speed histogram
 */
function PercentileInterpolator(histogram) {
  this.histogram = histogram;

  var offset = -0.5;  // R5 with linear estimation of both upper and lower extremes
  var a = getCDF.cumsum(histogram, offset);
  this.dist = getCDF.cumdist(a.cumsum, a.n);

  this.keys = {};
  this.keys['cdf'] = Object.keys(this.dist.cdf);
  this.keys['icdf'] = Object.keys(this.dist.icdf);

  this.midpt = {};
  this.midpt['cdf'] = this.keys.cdf[Math.floor(this.keys.cdf.length / 2)];
  this.midpt['icdf'] = this.keys.icdf[Math.floor(this.keys.icdf.length / 2)];
}

/**
 * find speed(s) corresponding to desired percentile(s)
 * @param  {Number | Array} speeds      speeds of interest
 * @return {Number | Array}             corresponding percentiles in decreasing order
 */
PercentileInterpolator.prototype.getPercentile = function(speeds) {
  return this._getYs('cdf', speeds);
};


/**
 * find speed(s) corresponding to desired percentile(s)
 * @param  {Number | Array} ps          percentiles of interest
 * @return {Number | Array}             corresponding speeds in decreasing order
 */
PercentileInterpolator.prototype.getSpeed = function(ps) {
  return this._getYs('icdf', ps);
};


/**
 * find y values corresponding to desired x values
 * @param  {String} type                cumulative distribution function or
 *                                      inverse cumulative distribution function
 * @param  {Number | Array} xs          x values of interest
 * @return {Number | Array}             corresponding y values in decreasing order
 */
PercentileInterpolator.prototype._getYs = function(type, xs) {

  // edge cases
  var keys = this.keys[type];
  if (keys.length < 0) return NaN;
  else if (keys.length === 1) {
    if (!Array.isArray(xs)) return +keys[0];

    var ys = [];
    for (var i = 0; i < xs.length; i++) {
      ys.push(+xs[0]);
    }
    return ys;
  }

  // ensure xs is an array
  if (!Array.isArray(xs)) xs = [xs];

  // if x is percentile
  if (type === 'icdf') xs = xs.map(function(x) { return x * 1e6; });

  // interpolate ys
  ys = this._piecewiseLinearInterpolation(type, xs);

  return ys.length > 1 ? ys : ys[0];
};


/**
 * piecewise linearly interpolate speeds from CDF
 * @param  {String} type  cumulative distribution function or
 *                        inverse cumulative distribution function
 * @param  {Array}  xs    array of independent variables
 * @return {Array}        corresponding speeds in descending order
 */
PercentileInterpolator.prototype._piecewiseLinearInterpolation = function(type, xs) {
  // count number of percentiles above midpoint
  var midpt = this.midpt[type];
  var aboveCount = xs.filter(function(x) { return x >= midpt; }).length;
  var belowCount = xs.length - aboveCount;

  if (aboveCount >= belowCount)
    return this._searchFromHigh(type, xs);  // descending order
  else
    return this._searchFromLow(type, xs)
               .sort(function(a, b) { return b - a; });   // sort in descending order
};


PercentileInterpolator.prototype._searchFromHigh = function(type, xs) {
  // sort percentiles in descending order
  xs.sort(function(a, b) { return b - a; });

  var dist = this.dist[type];
  var keys = this.keys[type];
  var k = keys.length - 2;   // pointer for keys
  var ys = [];

  // loop through desired percentiles
  for (var i = 0; i < xs.length; i++) {
    var x = xs[i];

    while (!(keys[k] <= x && x <= keys[k + 1])) {
      if (k - 1 >= 0) k--;
      else break;
    }

    var run = keys[k + 1] - keys[k];
    var rise = dist[keys[k + 1]] - dist[keys[k]];

    ys.push(dist[keys[k]] + rise / run * (x - keys[k]));
  }

  return ys;
};

PercentileInterpolator.prototype._searchFromLow = function(type, xs) {
  // sort percentiles in ascending order
  xs.sort(function(a, b) { return a - b; });

  var dist = this.dist[type];
  var keys = this.keys[type];
  var k = 0;   // pointer for keys
  var ys = [];

  // loop through desired percentiles
  for (var i = 0; i < xs.length; i++) {
    var x = xs[i];

    while (!(keys[k] <= x && x <= keys[k + 1])) {
      if (k + 2 < keys.length) k++;
      else break;
    }

    var run = keys[k + 1] - keys[k];
    var rise = dist[keys[k + 1]] - dist[keys[k]];

    ys.push(dist[keys[k]] + rise / run * (x - keys[k]));
  }

  return ys;
};
