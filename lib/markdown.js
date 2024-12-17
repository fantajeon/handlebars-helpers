'use strict';

var helpers = module.exports;
var handlebars = require('handlebars');
var marked = require('marked');

helpers.parseMarkdown = function(str, options) {
  return new handlebars.SafeString(marked.parse(str, options));
};
