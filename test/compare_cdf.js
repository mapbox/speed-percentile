'use strict';
var percentile = require('../percentile');
var scipyPercentile = require('./scipy_quantile');
var fs = require('fs');
var path = require('path');

var size = +process.argv[2];
var ps = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95];

var dir = path.join(__dirname, 'simulate_' + size);
var outfile = path.join(__dirname, 'simulate_' + size, 'cdfs.json');

var summary = {'ps': ps};

var tic = process.hrtime();

var promises = fs.readdirSync(dir)
.filter(function(file) {
  return path.extname(file) === '';
})
.map(function(file) {
  return new Promise(function(resolve, reject) {
    summary[file] = {'speed': {}};

    fs.readFile(path.join(dir, file), function(err, data) {
      if (err) reject(err);
      summarise(file, data);
      resolve();
    });
  });
});

Promise.all(promises)
.then(function() {
  fs.writeFileSync(outfile, JSON.stringify(summary, null, '\t'));
  console.log('Time Elasped: %d ms', process.hrtime(tic)[1] / 1e6);
}).catch(function(err) {
  console.err(err);
});


function summarise(dist, data) {
  var hist = JSON.parse(data);

  // percentile speed and computation time
  summary[dist].speed['R4'] = percentile(hist, ps, 'R4');
  summary[dist].speed['R5'] = percentile(hist, ps, 'R5');
  summary[dist].speed['scipy'] = scipyPercentile(hist, ps);
}
