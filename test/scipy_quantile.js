'use strict';

function scipyQuantile(hist, p) {

  var spawn = require('child_process').spawnSync;
  var pythonProcess = spawn('python',
                      ['scipy_quantile.py', '-u', JSON.stringify(hist), p]);

  if (pythonProcess.error !== undefined) {
    console.error(pythonProcess.error);
  }
  console.info('python process exited with code ' + pythonProcess.status);
  var results = pythonProcess.stdout.toString().split(',');
  var speeds = [];
  for (var i = 0; i < results.length; i++) {
    speeds.push(+results[i]);
  }
  return speeds;
}

module.exports = scipyQuantile;