# speed-percentile
[![Build Status](https://travis-ci.org/mapbox/speed-percentile.svg?branch=master)](https://travis-ci.org/mapbox/speed-percentile)

A JavaScript utility to compute percentile speed from speed histogram.

Example:

```
var percentile = require('speed-percentile');

var histogram = {20: 1, 21: 1, 22: 2, 23: 3, 24: 4, 25: 5};

var speed = percentile(histogram, 0.85, 'R4');
//=> 24.52
```

## Install

```
npm install speed-percentile
```

## Use

### Inputs

| position | data type | description |
|:--:|:--:|:--:|
| 0 | associative array with integer keys | speed histogram hash `{<speed>:<count>}`|
| 1 | number or array | one or more percentiles to compute |
| 2 | string | algorithm flag (optional): `'km'`, `'R4'`, `'R5'` (default) |

Algorithms:
* `km` – non-parametric Kaplan Meier estimator with piece-wise linear interpolation
* `R4` – [R](https://en.wikipedia.org/wiki/R_(programming_language))'s [sample quantile Type 4](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html), but with linearly interpolated lower tail
* `R5` – [R](https://en.wikipedia.org/wiki/R_(programming_language))'s [sample quantile Type 5 ](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html), but with both tails linearly interpolated


### Outputs

| position | data type | description |
|:--:|:--:|:--:|
| 0 | number or array | speed(s) corresponding to input 1 |
