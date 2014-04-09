window.__NonMonkeyPatchPromise__ = window.Promise;
window.__NonMonkeyPatchObserver__ = window.MutationObserver;
window.Promise = null;
window.MutationObserver = function (flush) {
  //Hacky way of making sure this is the flush from Traceur/ASAP
  if (flush.toString().indexOf('queue.length') > -1) {
    window.__asapFlush__ = flush;
  }
  else {
    return window.MutationObserver.apply(this, arguments);
  }
}
window.MutationObserver.prototype.observe = function() {
  //noop
};
