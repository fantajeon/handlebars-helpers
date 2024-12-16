'use strict';

var helpers = module.exports;
var marked = require('marked');

helpers.parseMarkdown = function(str, options) {
  return marked.parse(str, options);
};
