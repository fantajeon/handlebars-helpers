'use strict';

var helpers = module.exports;
var marked = require('marked');

helpers.parseMarkdown = function(str, options) {
  var hbs = helpers.handlebars || require('handlebars');
  return new hbs.SafeString(marked.parse(str, options));
};
