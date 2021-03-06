define(['../internal/baseIsEqual', '../internal/bindCallback', '../internal/isStrictComparable'], function(baseIsEqual, bindCallback, isStrictComparable) {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent. If `customizer` is provided it is invoked to compare values.
   * If `customizer` returns `undefined` comparisons are handled by the method
   * instead. The `customizer` is bound to `thisArg` and invoked with three
   * arguments; (value, other [, index|key]).
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Functions and DOM nodes
   * are **not** supported. Provide a customizer function to extend support
   * for comparing other values.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var other = { 'user': 'fred' };
   *
   * object == other;
   * // => false
   *
   * _.isEqual(object, other);
   * // => true
   *
   * // using a customizer callback
   * var array = ['hello', 'goodbye'];
   * var other = ['hi', 'goodbye'];
   *
   * _.isEqual(array, other, function(value, other) {
   *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
   * });
   * // => true
   */
  function isEqual(value, other, customizer, thisArg) {
    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
    if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
      return value === other;
    }
    var result = customizer ? customizer(value, other) : undefined;
    return typeof result == 'undefined' ? baseIsEqual(value, other, customizer) : !!result;
  }

  return isEqual;
});
