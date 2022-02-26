(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var ema = require('exponential-moving-average');
var sma = require('sma');

window.breakout_averages = { sma, ema };
},{"exponential-moving-average":2,"sma":5}],2:[function(require,module,exports){
'use strict';

var extend = require('extend-shallow');

module.exports = function(arr, options) {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }

  if (typeof options === 'number') {
    options = { range: options };
  }

  var defaults = {range: arr.length / 2, format: toFixed};
  var opts = extend({}, defaults, options);
  var range = opts.range;

  if (arr.length < range) {
    throw new RangeError('expected range to be greater than array length');
  }

  var c = smooth(range);
  var num = avg(arr.slice(0, range), opts);
  var acc = [opts.format(num)];
  for (var i = range; i < arr.length; i++) {
    num = (c * Number(arr[i])) + ((1 - c) * num);
    acc.push(opts.format(num));
  }
  return acc;
};

function avg(arr, options) {
  var len = arr.length, i = -1;
  var num = 0;
  while (++i < len) num += Number(arr[i]);
  return num / len;
}

function smooth(n) {
  return 2 / (n + 1);
}

function toFixed(n) {
  return n.toFixed(2);
}

},{"extend-shallow":3}],3:[function(require,module,exports){
'use strict';

var isObject = require('is-extendable');

module.exports = function extend(o/*, objects*/) {
  if (!isObject(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isObject(obj)) {
      assign(o, obj);
    }
  }
  return o;
};

function assign(a, b) {
  for (var key in b) {
    if (hasOwn(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

},{"is-extendable":4}],4:[function(require,module,exports){
/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isExtendable(val) {
  return typeof val !== 'undefined' && val !== null
    && (typeof val === 'object' || typeof val === 'function');
};

},{}],5:[function(require,module,exports){
'use strict';

/**
 * Calculate the simple moving average of an array. A new array is returned with the average
 * of each range of elements. A range will only be calculated when it contains enough elements to fill the range.
 *
 * ```js
 * console.log(sma([1, 2, 3, 4, 5, 6, 7, 8, 9], 4));
 * //=> [ '2.50', '3.50', '4.50', '5.50', '6.50', '7.50' ]
 * //=>   │       │       │       │       │       └─(6+7+8+9)/4
 * //=>   │       │       │       │       └─(5+6+7+8)/4
 * //=>   │       │       │       └─(4+5+6+7)/4
 * //=>   │       │       └─(3+4+5+6)/4
 * //=>   │       └─(2+3+4+5)/4
 * //=>   └─(1+2+3+4)/4
 * ```
 * @param  {Array} `arr` Array of numbers to calculate.
 * @param  {Number} `range` Size of the window to use to when calculating the average for each range. Defaults to array length.
 * @param  {Function} `format` Custom format function called on each calculated average. Defaults to `n.toFixed(2)`.
 * @return {Array} Resulting array of averages.
 * @api public
 */

function sma(arr, range, format) {
  if (!Array.isArray(arr)) {
    throw TypeError('expected first argument to be an array');
  }

  var fn = typeof format === 'function' ? format : toFixed;
  var num = range || arr.length;
  var res = [];
  var len = arr.length + 1;
  var idx = num - 1;
  while (++idx < len) {
    res.push(fn(avg(arr, idx, num)));
  }
  return res;
}

/**
 * Create an average for the specified range.
 *
 * ```js
 * console.log(avg([1, 2, 3, 4, 5, 6, 7, 8, 9], 5, 4));
 * //=> 3.5
 * ```
 * @param  {Array} `arr` Array to pull the range from.
 * @param  {Number} `idx` Index of element being calculated
 * @param  {Number} `range` Size of range to calculate.
 * @return {Number} Average of range.
 */

function avg(arr, idx, range) {
  return sum(arr.slice(idx - range, idx)) / range;
}

/**
 * Calculate the sum of an array.
 * @param  {Array} `arr` Array
 * @return {Number} Sum
 */

function sum(arr) {
  var len = arr.length;
  var num = 0;
  while (len--) num += Number(arr[len]);
  return num;
}

/**
 * Default format method.
 * @param  {Number} `n` Number to format.
 * @return {String} Formatted number.
 */

function toFixed(n) {
  return n.toFixed(2);
}

/**
 * Expose `sma`
 */

module.exports = sma;

},{}]},{},[1]);
