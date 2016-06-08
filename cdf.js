'use strict';

function cumsum(histogram, offset=0) {
  var n = 0;
  var sums = {};
  for (var speed in histogram) {  // speeds already in ascending order
    n += histogram[speed];
    sums[speed] = n + offset*histogram[speed];
  }

  return {sums: sums, n: n};
}


function R4CDF(histogram, offset=0) {
  var {sums, n} = cumsum(histogram, offset);

  var cdf = {};
  for (var speed in sums) {  // speeds already in ascending order
    cdf[speed] = sums[speed]/n;
  }

  return {cdf: cdf, n: n};
}


// modified Kaplan Meier estimator
function ksCDF(histogram) {

  var {sums, n} = cumsum(histogram);

  var cdf = {};
  var j = 0;
  var s = 1;  // survival

  for (var speed in sums) {
    while (j <= sums[speed]) {
      var theta = Math.random();
      s *= ((n-j-1) / (n-j-theta));
      j++;
    }
    cdf[speed] = 1-s;
  }

  return {cdf: cdf, n: n};
}


module.exports = {ksCDF: ksCDF,
                  R4CDF: R4CDF};
