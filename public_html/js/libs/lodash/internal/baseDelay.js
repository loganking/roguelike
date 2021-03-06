define(['./baseSlice', '../lang/isFunction'], function(baseSlice, isFunction) {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * The base implementation of `_.delay` and `_.defer` which accepts an index
   * of where to slice the arguments to provide to `func`.
   *
   * @private
   * @param {Function} func The function to delay.
   * @param {number} wait The number of milliseconds to delay invocation.
   * @param {Object} args The `arguments` object to slice and provide to `func`.
   * @returns {number} Returns the timer id.
   */
  function baseDelay(func, wait, args, fromIndex) {
    if (!isFunction(func)) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return setTimeout(function() { func.apply(undefined, baseSlice(args, fromIndex)); }, wait);
  }

  return baseDelay;
});
