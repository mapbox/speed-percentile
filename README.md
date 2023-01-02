# speed-percentile
[![Build Status](https://travis-ci.org/mapbox/speed-percentile.svg?branch=master)](https://travis-ci.org/mapbox/speed-percentile)

A JavaScript utility to compute percentile speed from speed histogram.


## Install

```
npm install @mapbox/speed-percentile
```

## Test

`cd` to speed-percentile folder then run
```
npm test
```

## Use

### v1.x

**`var o1 = percentile(P1, P2, P3)`**

Computes the *p*-th precentile speed from a sparse hash speed histogram.

__Inputs:__

| param | data type | description |
|---|---|---|
| `P1` | associative array with integer keys | speed histogram hash `{<speed>:<count>}`|
| `P2` | number or array | one or more percentiles *in decimal* |
| `P3` | string | algorithm flag (optional): `'R4'`, `'R5'` (default) |

Algorithms:
* `R4` – [R](https://en.wikipedia.org/wiki/R_(programming_language))'s [sample quantile Type 4](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html), but with linearly interpolated lower tail
* `R5` – [R](https://en.wikipedia.org/wiki/R_(programming_language))'s [sample quantile Type 5](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html), but with both tails linearly interpolated


__Outputs:__

| output | data type | description |
|:--|:--|:--|
| `o1` | number or array | corresponding speed(s) ***sorted in descending order*** |


### v2.x

v2.x only has R5 algorithm.

```
var PercentileInterpolator = require('@mapbox/speed-percentile');

var hist = {10: 2, 30: 3, 40: 4};
var pi = new PercentileInterpolator(hist);  

// find speed from percentile
var speed = pi.getSpeed(0.7);
var speeds = pi.getSpeed([0.1, 0.7]);  // irrespective of input order, output is always in descending order

// find percentile from speed
var p = pi.getPercentile(30);
var ps = pi.getPercentile([20, 30]);   // irrespective of input order, output is always in descending order
```
test
