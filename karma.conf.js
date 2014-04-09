var sharedConfig = require('pipe/karma');
var path = require('path');

module.exports = function(config) {
  sharedConfig(config);
  config.plugins.push(path.resolve('karma/karma-plugin.js'));
  config.frameworks.push('traceur-promise-mock');
  config.set({
    // list of files / patterns to load in the browser
    files: [
      'test-main.js',
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'test/**/*.js', included: false},
      {pattern: 'node_modules/di/src/**/*.js', included: false},
      {pattern: 'node_modules/pipe/node_modules/assert/dist/amd/**/*.js', included: false},
      {pattern: 'node_modules/di/node_modules/es6-shim/es6-shim.js', included: false}
    ],

    preprocessors: {
      'node_modules/di/src/**/*.js': ['traceur'],
      'src/**/*.js': ['traceur'],
      'test/**/*.js': ['traceur']
    }
  });
};
