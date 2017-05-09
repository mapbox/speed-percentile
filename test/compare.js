/**
 * node test/compare.js 20
 */
'use strict';

var PercentileInterpolator = require('../lib/percentile.js');
var scipyPercentile = require('./scipy_quantile.js');
var fs = require('fs');
var path = require('path');

var size = +process.argv[2];

var dir = path.join(__dirname, './simulate_' + size);
var outfile = path.join(dir, 'summary.json');

var p = 0.7;
var summary = {'p': p, 'size': size};

var tic = process.hrtime();

var promises = fs.readdirSync(dir)
.filter(function(file) {
  return path.extname(file) === '';
})
.map(function(distName) {
  return new Promise(function(resolve, reject) {
    summary[distName] = {'speed': {}, 'time': {}};

    // load sample histogram
    fs.readFile(path.join(dir, distName), function(err, data) {
      if (err) reject(err);

      // compute percentile speed
      summarise(distName, data);
      resolve();
    });
  });
});

Promise.all(promises)
.then(function() {
  // write out speeds
  fs.writeFileSync(outfile, JSON.stringify(summary, null, '\t'));
  console.log('Time Elasped: %d ms', process.hrtime(tic)[1] / 1e6);
}).catch(function(err) {
  console.err(err);
});


function summarise(distName, data) {
  var hist = JSON.parse(data);

  // max speed
  summary[distName].speed['max'] = +Object.keys(hist).pop();

  // R5
  var pi = new PercentileInterpolator(hist);
  summary[distName].speed['R5'] = +pi.getSpeed(p).toFixed(2);

  // scipy
  summary[distName].speed['scipy'] = scipyPercentile(hist, p);
}

