'use strict';
var tic = process.hrtime();

var percentile = require('../percentile');
var scipyPercentile = require('./scipy_quantile');
var fs = require('fs');
var path = require('path');

var size = +process.argv[2];

var dir = path.join(__dirname, './simulate_' + size);
var outfile = path.join(dir, 'summary.json');

var p = 0.7;
var summary = {'p': p, 'size': size};
var algorithms = {'R4': percentile,
                  'R5': percentile,
                  'scipy': scipyPercentile};


var promises = fs.readdirSync(dir)
.filter(function (file) {
  return path.extname(file) === '';
})
.map(function (distName) {
  return new Promise(function(resolve, reject) {
    summary[distName] = {'speed': {}, 'time': {}};

    // load sample histogram
    fs.readFile(path.join(dir, distName), function (err, data) {
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
  console.log('Time Elasped: %d ms', process.hrtime(tic)[1]/1e6);
}).catch(function (err) {
  console.err(err);
});


function summarise(distName, data) {
  var hist = JSON.parse(data);

  // max speed
  summary[distName].speed['max'] = +Object.keys(hist).pop();

  // percentile speed and computation time
  Object.keys(algorithms).forEach(function (flag) {
    // excess param is discarded anyways
    var r = timeprocess(algorithms[flag], [hist, p, flag]);
    summary[distName].speed[flag] = r.result;
    summary[distName].time[flag] = r.time;
  });
}

function timeprocess(fn, args) {
  var hrstart = process.hrtime();
  var result = fn.apply(null, args);
  var hrend = process.hrtime(hrstart);
  return {'result': +result, 'time': hrend[1]/1e6};  //time in ms
}