var tap = require('tap');
var speedPercentile = require('../percentile.js');
var kmMedian = require('../km_median.js');

var hists = [
  {'35':1, '36':1, '37':4, '38':2, '40':1, '42':1, '43':1},
  {'15':2, '20': 2, '32':2, '60':2}
];

pss = [
  [0.1, 0.125, 0.2, 0.3, 0.375, 0.4, 0.5, 0.6, 0.625, 0.7, 0.8, 0.875, 0.9],
  [0.01, 0.99],
  0.85
];

types = ['km', 'R4', 'R5'];


hists.forEach(function (hist) {
  // check km median
  console.log('Testing km median:');
  tap.type(kmMedian(hist), 'number', 'data type');

  // check percentiles
  types.forEach(function (type) {
    console.log('Testing algorithm ' + type + ':');
    pss.forEach(function (ps) {
      qs = speedPercentile(hist, ps, type);
      if (typeof ps === 'number') {
        tap.type(qs, 'number', 'data type');

      } else {
        tap.equal(qs.length, ps.length, 'array length');
        qs.forEach(function (q) {
          tap.type(q, 'number', 'data type');
        });
      }
    });

  });
});
