# Karma Traceur Promise Mock

This project includes a karma plugin, as well as an ES6 class to monkey-patch
Traceur's implementation of `Promise` in order to make the asynchronous promise
microtasks flushable and synchronous inside of tests. This is an experiment to
see if the Traceur Promise could be made flushable without changing the Traceur
implementation.

It accomplishes this by a series of ~~hacks~~ creative techniques:
 * Before Traceur runtime is loaded:
    * set window.Promise to null so that Traceur will not defer to the native
    implementation.
    * create a mock Mutation Observer to capture the flush method passed in by
      RSVP/ASAP used by Traceur's Promise
 * After Traceur runtime is loaded, restore the native MutationObserver.
 * Provide an injectable class, `PromiseMicroTask`, to flush the Promise's
    microtask queue. Also provides methods for restoring the global Traceur or
    Native version of promise.


## Add as Karma Plugin

```javascript
//karma.conf.js
module.exports = function(config) {
  config.set({
    plugins: ['karma-traceur-preprocessor', 'node_modules/karma-traceur-promise-mock'],
    //Important that traceur-promise-mock is after traceur in the frameworks list
    frameworks: ['jasmine', 'traceur', 'requirejs', 'traceur-promise-mock']
    ...
  });
};
```

## Class `PromiseMicroTask`

### Instance Methods
| name             | description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| flush()          | Immediately flushes all pending operations queued by Traceur's Promise |
| restoreNative()  | Restores the native implementation of promise to the window            |
| restoreTraceur() | Restores the Traceur implementation of Promise to the window           |

### Use in Tests

```javascript
import {PromiseMicroTask} from 'node_modules/karma-traceur-promise-mock/src/PromiseMicroTask';
import {use, inject} from 'node_modules/di/src/testing';
describe('RandomPromise', function() {
  it('should return a result', inject(PromiseMicroTask, function(promiseMicroTask) {
    var goodSpy = jasmine.createSpy();
    new Promise(function(resolve, reject) {
      resolve('200 OK');
    }).then(goodSpy);
    promiseMicroTask.flush();
    expect(goodSpy).toHaveBeenCalledWith('200 OK');
  }));
});
```
