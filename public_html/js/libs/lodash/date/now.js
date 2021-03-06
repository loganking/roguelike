define(['../lang/isNative'], function(isNative) {

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeNow = isNative(nativeNow = Date.now) && nativeNow;

  /**
   * Gets the number of milliseconds that have elapsed since the Unix epoch
   * (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @category Date
   * @example
   *
   * _.defer(function(stamp) { console.log(_.now() - stamp); }, _.now());
   * // => logs the number of milliseconds it took for the deferred function to be invoked
   */
  var now = nativeNow || function() {
    return new Date().getTime();
  };

  return now;
});
