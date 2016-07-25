'use strict';
var path = require('path');

module.exports = function(hist, ps) {

  // execute python script
  var script = path.join(__dirname, 'scipy_quantile.py');
  var spawn = require('child_process').spawnSync;
  var pythonProcess = spawn('python', [script, '-u', JSON.stringify(hist), ps]);

  // error in python script
  if (pythonProcess.error !== undefined) {
    console.error(pythonProcess.error);
    return NaN;
  }
  if (pythonProcess.status !== 0) {
    console.log(pythonProcess.output.toString());
    return NaN;
  }

  // parse and return scipy results
  console.info('python process exited with code ' + pythonProcess.status);
  var results = pythonProcess.stdout.toString().split(',');

  var speeds = [];
  for (var i = 0; i < results.length; i++) {
    speeds.push(+results[i]);
  }
  return speeds;
};