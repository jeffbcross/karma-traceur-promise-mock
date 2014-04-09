var path = require('path');

function promiseFramework (files) {
  files.unshift({
    pattern: path.resolve(__dirname, 'monkey-patch.js'),
    included: true,
    served: true,
    watched: false
  });
  files.push({
    pattern: path.resolve(__dirname, 'un-monkey-patch.js'),
    included: true,
    served: true,
    watched: false
  });
}
promiseFramework.$inject = ['config.files'];
module.exports = {
  'framework:traceur-promise-mock': ['factory', promiseFramework],
};