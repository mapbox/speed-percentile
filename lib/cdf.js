'use strict';


module.exports = {
  cumsum: cumsum,
  cumdist: cumdist
};

/**
 * computes the cumulative sum
 * @param  {Object} histogram   histogram
 * @param  {Number} offset      amount to offset the "knots" (see wiki)
 * @return {Object}             an object with cumulative sum and total count
 *                              as properties
 */
function cumsum(histogram, offset) {
  if (offset === undefined) offset = 0;

  var n = 0;
  var cumsum = {};
  for (var speed in histogram) {  // speeds already in ascending order
    n += histogram[speed];
    cumsum[speed] = n + offset * histogram[speed];
  }

  return {cumsum: cumsum, n: n};
}


/**
 * computes the cumulative distribution function (CDF)
 * @param  {Object}  cumsum      cumulative sum hash
 * @param  {Integer} n           total count
 * @return {Object}              cumulative distribution function and
 *                               inverse cumlative distribution function
 */
function cumdist(cumsum, n) {
  var cdf = {};
  var icdf = {};
  for (var speed in cumsum) {  // speeds already in ascending order
    cdf[speed] = cumsum[speed] / n;

    // multiply by 1e6 so that key is integer (ensures ascending order)
    icdf[Math.round(cdf[speed] * 1e6)] = +speed;
  }

  // linearly interpolate upper tail
  // (for faster computation, key of cdf hash is integer; therefore round off values of icdf hash as well)
  var ps = Object.keys(icdf);
  var l = ps[ps.length - 2];
  var r = ps[ps.length - 1];
  var run = r - l;
  var rise = icdf[r] - icdf[l];
  var newspeed = Math.round(+icdf[r] + rise / run * (1e6 - r));
  icdf[1e6] = newspeed;
  cdf[newspeed] = 1;

  // linearly interpolate lower tail
  // (for faster computation, key of cdf hash is integer; therefore round off values of icdf hash as well)
  l = ps[0];
  r = ps[1];
  run = r - l;
  rise = icdf[r] - icdf[l];
  newspeed = Math.round(+icdf[l] - rise / run);
  icdf[0] = newspeed;
  cdf[newspeed] = 0;

  return {cdf: cdf, icdf: icdf};
}





