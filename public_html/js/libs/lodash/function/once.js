define(['./before'], function(before) {

  /**
   * Creates a function that is restricted to invoking `func` once. Repeat calls
   * to the function return the value of the first call. The `func` is invoked
   * with the `this` binding of the created function.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Function
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // `initialize` invokes `createApplication` once
   */
  function once(func) {
    return before(func, 2);
  }

  return once;
});
