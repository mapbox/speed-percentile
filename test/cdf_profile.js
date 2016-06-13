'use strict';
var speedPercentile = require('../percentile.js');
var scipyPercentile = require('./scipy_quantile.js');
var fs = require('fs');
var path = require('path');

var size = +process.argv[2];
var ps = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95];

var dir = './simulate_' + size;
var outfile = 'profile.json';

var summary = {'ps': ps};
var algorithms = {'km': speedPercentile,
                  'R4': speedPercentile,
                  'R5': speedPercentile,
                  'scipy': scipyPercentile};

var promises = fs.readdirSync(dir)
.filter(function (file) {
  return path.extname(file) === '';
})
.map(function (file) {
  return new Promise(function (resolve, reject) {
    summary[file] = {'speed': {}};

    fs.readFile(path.join(dir, file), function (err, data) {
      if (err) reject(err);
      summarise(file, data);
      resolve();
    });
  });
});

Promise.all(promises)
.then(function() {
  fs.writeFile(path.join(dir, outfile), JSON.stringify(summary, null, '\t'));
  console.log('Time Elasped: %d ms', process.hrtime(tic)[1]/1e6);
}).catch(function (err) {
  console.err(err);
});


function summarise(dist, data) {
  var hist = JSON.parse(data);

  // percentile speed and computation time
  Object.keys(algorithms).forEach(function (flag) {
    summary[dist].speed[flag] = algorithms[flag](hist, ps, flag);
  });
}