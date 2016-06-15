'use strict';
var tic = process.hrtime();

var speedPercentile = require('../percentile.js');
var kmMedian = require('../km_median.js');
var scipyPercentile = require('./scipy_quantile.js');
var fs = require('fs');
var path = require('path');

var size = +process.argv[2];

var dir = './simulate_' + size;
var outfile = 'summary2.json';

var summary = {'size': size};
var algorithms = {'km_median': kmMedian,
                  'km': speedPercentile,
                  'R4': speedPercentile,
                  'R5': speedPercentile,
                  'scipy': scipyPercentile};

var promises = fs.readdirSync(dir)
.filter(function (file) {
  return path.extname(file) === '';
})
.map(function (file) {
  return new Promise(function (resolve, reject) {
    summary[file] = {'speed': {}, 'time': {}};

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

  // max speed
  summary[dist].speed['max'] = +Object.keys(hist).pop();


  // percentile speed and computation time
  Object.keys(algorithms).forEach(function (flag) {
    var p = flag.startsWith('km') ? 0.5 : 0.7;
    // excess param is discarded anyways
    var r = timeprocess(algorithms[flag], [hist, p, flag]);
    summary[dist].speed[flag] = r.result;
    summary[dist].time[flag] = r.time;

    // note: result for 'km' will be slightly different from 'km_median' because of random theta.
  });
}

function timeprocess(fn, args) {
  var hrstart = process.hrtime();
  var result = fn.apply(null, args);
  var hrend = process.hrtime(hrstart);
  return {'result': +result, 'time': hrend[1]/1e6};  //time in ms
}