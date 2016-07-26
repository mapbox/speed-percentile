'use strict';

/**
 * computes the cumulative distribution function (CDF)
 * @param  {Object} histogram   histogram
 * @param  {Number} offset      amount to offset the "knots" (see wiki)
 * @return {Object}             cumulative distribution function
 */
module.exports = function CDF(histogram, offset) {
  if (offset === undefined) offset = 0;

  var result = module.exports.cumsum(histogram, offset);
  var cumsum = result.cumsum;
  var n = result.n;

  var cdf = {};
  for (var speed in cumsum) {  // speeds already in ascending order
    cdf[speed] = cumsum[speed] / n;
  }

  return cdf;
};



/**
 * computes the cumulative sum
 * @param  {Object} histogram   histogram
 * @param  {Number} offset      amount to offset the "knots" (see wiki)
 * @return {Object}             an object with cumulative sum and total count
 *                              as properties
 */
module.exports.cumsum = function(histogram, offset) {
  if (offset === undefined) offset = 0;

  var n = 0;
  var cumsum = {};
  for (var speed in histogram) {  // speeds already in ascending order
    n += histogram[speed];
    cumsum[speed] = n + offset * histogram[speed];
  }

  return {cumsum: cumsum, n: n};
};


