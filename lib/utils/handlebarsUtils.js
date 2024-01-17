'use strict';

/**
 * This code was taken directly from handlebars-helpers, (extracting some utils to its own file)
 * https://github.com/helpers/handlebars-utils/blob/master/index.js#L398
 * 
 * that was taken directly from handlebars.
 * https://github.com/wycats/handlebars.js/blob/b55a120e8222785db3dc00096f6afbf91b656e8a/LICENSE
 * Released under the MIT License
 * Copyright (C) 2011-2016 by Yehuda Katz
 */

var util = require('util');
var type = require('typeof-article');
var utils = exports = module.exports;

utils.isObject = require('./isObject');
utils.isOptions = require('./isOptions');
utils.isUndefined = require('./isUndefined');
utils.result = require('./result');
utils.extend = extend;
utils.indexOf = require('./indexOf');
utils.escapeExpression = escapeExpression;
utils.isEmpty = isEmpty;
utils.createFrame = createFrame;
utils.blockParams = blockParams;
utils.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g;
var possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

utils.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  utils.isFunction = isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
utils.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function(value) {
  return value && typeof value === 'object'
    ? toString.call(value) === '[object Array]'
    : false;
};

utils.isArray = isArray;

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}

//
// The code below this line was not sourced from handlebars
// --------------------------------------------------------
//

utils.expectedType = function(param, expected, actual) {
  var exp = type.types[expected];
  var val = util.inspect(actual);
  return 'expected ' + param + ' to be ' + exp + ' but received ' + type(actual) + ': ' + val;
};

utils.isBlock = require('./isBlock');

/**
 * Returns the given value or renders the block if it's a block helper.
 *
 * ```js
 * Handlebars.registerHelper('example', function(val, locals, options) {
 *   return utils.fn(val, locals, options);
 * });
 * ```
 * @param {any} `val`
 * @param {Object} `options`
 * @param {Object} `context`
 * @return {String} Either returns the value, or renders the block.
 * @api public
 */

utils.fn = function(val, context, options) {
  if (utils.isOptions(val)) {
    return utils.fn('', val, options);
  }
  if (utils.isOptions(context)) {
    return utils.fn(val, {}, context);
  }
  return utils.isBlock(options) ? options.fn(context) : val;
};

/**
 * Returns the given value or renders the inverse block if it's a block helper.
 *
 * ```js
 * Handlebars.registerHelper('example', function(val, locals, options) {
 *   return utils.inverse(val, locals, options);
 * });
 * ```
 * @param {any} `val`
 * @param {Object} `options`
 * @param {Object} `context`
 * @return {String} Either returns the value, or renders the inverse block.
 * @api public
 */

utils.inverse = function(val, context, options) {
  if (utils.isOptions(val)) {
    return utils.identity('', val, options);
  }
  if (utils.isOptions(context)) {
    return utils.inverse(val, {}, context);
  }
  return utils.isBlock(options) ? options.inverse(context) : val;
};

utils.value = require('./value');

/**
 * Returns true if an `app` propery is on the context, which means
 * the context was created by [assemble][], [templates][], [verb][],
 * or any other library that follows this convention.
 *
 * ```js
 * Handlebars.registerHelper('example', function(val, options) {
 *   var context = options.hash;
 *   if (utils.isApp(this)) {
 *     context = Object.assign({}, this.context, context);
 *   }
 *   // do stuff
 * });
 * ```
 * @param {any} `value`
 * @return {Boolean}
 * @api public
 */

utils.isApp = function(thisArg) {
  return utils.isObject(thisArg)
    && utils.isObject(thisArg.options)
    && utils.isObject(thisArg.app);
};

/**
 * Creates an options object from the `context`, `locals` and `options.`
 * Handlebars' `options.hash` is merged onto the options, and if the context
 * is created by [templates][], `this.options` will be merged onto the
 * options as well.
 *
 * @param {Object} `context`
 * @param {Object} `locals` Options or locals
 * @param {Object} `options`
 * @return {Boolean}
 * @api public
 */

utils.options = function(thisArg, locals, options) {
  if (utils.isOptions(thisArg)) {
    return utils.options({}, locals, thisArg);
  }
  if (utils.isOptions(locals)) {
    return utils.options(thisArg, options, locals);
  }
  options = options || {};
  if (!utils.isOptions(options)) {
    locals = Object.assign({}, locals, options);
  }
  var opts = Object.assign({}, locals, options.hash);
  if (utils.isObject(thisArg)) {
    opts = Object.assign({}, thisArg.options, opts);
  }
  if (opts[options.name]) {
    opts = Object.assign({}, opts[options.name], opts);
  }
  return opts;
};

/**
 * Get the context to use for rendering.
 *
 * @param {Object} `thisArg` Optional invocation context `this`
 * @return {Object}
 * @api public
 */

utils.context = function(thisArg, locals, options) {
  if (utils.isOptions(thisArg)) {
    return utils.context({}, locals, thisArg);
  }
  // ensure args are in the correct order
  if (utils.isOptions(locals)) {
    return utils.context(thisArg, options, locals);
  }
  var appContext = utils.isApp(thisArg) ? thisArg.context : {};
  options = options || {};

  // if "options" is not handlebars options, merge it onto locals
  if (!utils.isOptions(options)) {
    locals = Object.assign({}, locals, options);
  }
  // merge handlebars root data onto locals if specified on the hash
  if (utils.isOptions(options) && options.hash.root === true) {
    locals = Object.assign({}, options.data.root, locals);
  }
  var context = Object.assign({}, appContext, locals, options.hash);
  if (!utils.isApp(thisArg)) {
    context = Object.assign({}, thisArg, context);
  }
  if (utils.isApp(thisArg) && thisArg.view && thisArg.view.data) {
    context = Object.assign({}, context, thisArg.view.data);
  }
  return context;
};

/**
 * Returns true if the given value is "empty".
 *
 * ```js
 * console.log(utils.isEmpty(0));
 * //=> false
 * console.log(utils.isEmpty(''));
 * //=> true
 * console.log(utils.isEmpty([]));
 * //=> true
 * console.log(utils.isEmpty({}));
 * //=> true
 * ```
 * @name .isEmpty
 * @param {any} `value`
 * @return {Boolean}
 * @api public
 */

function isEmpty(val) {
  if (val === 0 || typeof val === 'boolean') {
    return false;
  }
  if (val == null) {
    return true;
  }
  if (utils.isObject(val)) {
    val = Object.keys(val);
  }
  if (!val.length) {
    return true;
  }
  return false;
}

/**
 * Returns the given value as-is, unchanged.
 *
 * ```js
 * console.log(utils.result('foo'));
 * //=> 'foo'
 * console.log(utils.result(function() {
 *   return 'foo';
 * }));
 * //=> [function]
 * ```
 * @param  {any} `val`
 * @return {any}
 * @api public
 */

utils.identity = function(val) {
  return val;
};

utils.isString = require('./isString');

/**
 * Cast the given `val` to an array.
 *
 * ```js
 * console.log(utils.arrayify(''));
 * //=> []
 * console.log(utils.arrayify('foo'));
 * //=> ['foo']
 * console.log(utils.arrayify(['foo']));
 * //=> ['foo']
 * ```
 * @param  {any} `val`
 * @return {Array}
 * @api public
 */

utils.arrayify = function(val) {
  return val != null ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Try to parse the given `string` as JSON. Fails
 * gracefully and always returns an object if the value cannot be parsed.
 *
 * @param {String} `string`
 * @return {Object}
 * @api public
 */

utils.tryParse = function(str) {
  try {
    return JSON.parse(str);
  } catch (err) {}
  return {};
};
