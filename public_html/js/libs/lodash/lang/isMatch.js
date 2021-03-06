define(['../internal/baseIsMatch', '../internal/bindCallback', '../internal/isStrictComparable', '../object/keys'], function(baseIsMatch, bindCallback, isStrictComparable, keys) {

  /** Used for native method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Performs a deep comparison between `object` and `source` to determine if
   * `object` contains equivalent property values. If `customizer` is provided
   * it is invoked to compare values. If `customizer` returns `undefined`
   * comparisons are handled by the method instead. The `customizer` is bound
   * to `thisArg` and invoked with three arguments; (value, other, index|key).
   *
   * **Note:** This method supports comparing properties of arrays, booleans,
   * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
   * and DOM nodes are **not** supported. Provide a customizer function to extend
   * support for comparing other values.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {Object} source The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   * @example
   *
   * var object = { 'user': 'fred', 'age': 40 };
   *
   * _.isMatch(object, { 'age': 40 });
   * // => true
   *
   * _.isMatch(object, { 'age': 36 });
   * // => false
   *
   * // using a customizer callback
   * var object = { 'greeting': 'hello' };
   * var source = { 'greeting': 'hi' };
   *
   * _.isMatch(object, source, function(value, other) {
   *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
   * });
   * // => true
   */
  function isMatch(object, source, customizer, thisArg) {
    var props = keys(source),
        length = props.length;

    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
    if (!customizer && length == 1) {
      var key = props[0],
          value = source[key];

      if (isStrictComparable(value)) {
        return object != null && value === object[key] && hasOwnProperty.call(object, key);
      }
    }
    var values = Array(length),
        strictCompareFlags = Array(length);

    while (length--) {
      value = values[length] = source[props[length]];
      strictCompareFlags[length] = isStrictComparable(value);
    }
    return baseIsMatch(object, props, values, strictCompareFlags, customizer);
  }

  return isMatch;
});
