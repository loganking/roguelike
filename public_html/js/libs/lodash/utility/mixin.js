define(['../internal/arrayCopy', '../internal/baseFunctions', '../lang/isFunction', '../lang/isObject', '../object/keys'], function(arrayCopy, baseFunctions, isFunction, isObject, keys) {

  /** Used for native method references. */
  var arrayProto = Array.prototype;

  /** Native method references. */
  var push = arrayProto.push;

  /**
   * Adds all own enumerable function properties of a source object to the
   * destination object. If `object` is a function then methods are added to
   * its prototype as well.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Function|Object} [object=this] object The destination object.
   * @param {Object} source The object of functions to add.
   * @param {Object} [options] The options object.
   * @param {boolean} [options.chain=true] Specify whether the functions added
   *  are chainable.
   * @returns {Function|Object} Returns `object`.
   * @example
   *
   * function vowels(string) {
   *   return _.filter(string, function(v) {
   *     return /[aeiou]/i.test(v);
   *   });
   * }
   *
   * _.mixin({ 'vowels': vowels });
   * _.vowels('fred');
   * // => ['e']
   *
   * _('fred').vowels().value();
   * // => ['e']
   *
   * _.mixin({ 'vowels': vowels }, { 'chain': false });
   * _('fred').vowels();
   * // => ['e']
   */
  function mixin(object, source, options) {
    var methodNames = baseFunctions(source, keys(source));

    var chain = true,
        index = -1,
        isFunc = isFunction(object),
        length = methodNames.length;

    if (options === false) {
      chain = false;
    } else if (isObject(options) && 'chain' in options) {
      chain = options.chain;
    }
    while (++index < length) {
      var methodName = methodNames[index],
          func = source[methodName];

      object[methodName] = func;
      if (isFunc) {
        object.prototype[methodName] = (function(func) {
          return function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__);
              (result.__actions__ = arrayCopy(this.__actions__)).push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            var args = [this.value()];
            push.apply(args, arguments);
            return func.apply(object, args);
          };
        }(func));
      }
    }
    return object;
  }

  return mixin;
});
