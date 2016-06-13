'use strict';

function scipyQuantile(hist, p) {

  var spawn = require('child_process').spawnSync;
  var pythonProcess = spawn('python',
                      ['scipy_quantile.py', '-u', JSON.stringify(hist), p]);

  if (pythonProcess.error !== undefined) {
    console.error(pythonProcess.error);
  }
  console.info('python process exited with code ' + pythonProcess.status);
  return pythonProcess.stdout.toString();
}

module.exports = scipyQuantile;