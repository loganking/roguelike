define(['../internal/baseCallback', '../internal/baseFind', '../internal/baseForOwn'], function(baseCallback, baseFind, baseForOwn) {

  /**
   * This method is like `_.findIndex` except that it returns the key of the
   * first element `predicate` returns truthy for, instead of the element itself.
   *
   * If a property name is provided for `predicate` the created "_.property"
   * style callback returns the property value of the given element.
   *
   * If an object is provided for `predicate` the created "_.matches" style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration. If a property name or object is provided it is used to
   *  create a "_.property" or "_.matches" style callback respectively.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
   * @example
   *
   * var users = {
   *   'barney':  { 'age': 36, 'active': true },
   *   'fred':    { 'age': 40, 'active': false },
   *   'pebbles': { 'age': 1,  'active': true }
   * };
   *
   * _.findKey(users, function(chr) { return chr.age < 40; });
   * // => 'barney' (iteration order is not guaranteed)
   *
   * // using the "_.matches" callback shorthand
   * _.findKey(users, { 'age': 1 });
   * // => 'pebbles'
   *
   * // using the "_.property" callback shorthand
   * _.findKey(users, 'active');
   * // => 'barney'
   */
  function findKey(object, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    return baseFind(object, predicate, baseForOwn, true);
  }

  return findKey;
});
