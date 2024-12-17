import Handlebars from 'handlebars';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { JsonTreeView } from '../components/JsonTreeView';
import { CustomButton } from '../components/Button';
//const H = require("just-handlebars-helpers");
var helpers = require('@fantajeon/handlebars-helpers')([
  'array',
  'object',
  'math',
  'html',
  'string',
  'url',
  'collection',
  'date',
  'function',
  'logic',
  'number',
  'markdown',
], {
  handlebars: Handlebars
});

//H.registerHelpers(Handlebars);

// JsonTree helper
Handlebars.registerHelper('JsonTree', function(jsonData) {
  const containerId = `json-tree-${Math.random().toString(36).substring(7)}`;
  
  setTimeout(() => {
    const container = document.getElementById(containerId);
    if (container) {
      const root = createRoot(container);
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      root.render(React.createElement(JsonTreeView, { data }));
    }
  }, 0);

  return new Handlebars.SafeString(`<div id="${containerId}"></div>`);
});

// Button helper
Handlebars.registerHelper('Button', function(label, href) {
  const buttonId = `mui-button-${Math.random().toString(36).substring(7)}`;
  const placeholderHtml = `<div id="${buttonId}"></div>`;

  setTimeout(() => {
    const container = document.getElementById(buttonId);
    if (container) {
      const root = createRoot(container);
      root.render(React.createElement(CustomButton, { label, href }));
    }
  }, 0);

  return new Handlebars.SafeString(placeholderHtml);
});

// Link helper
Handlebars.registerHelper('link', function(text, url) {
  var url = Handlebars.escapeExpression(url),
      text = Handlebars.escapeExpression(text);
  return new Handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
});

// HTML escape helper
Handlebars.registerHelper('escapeHtml', function(text) {
  return Handlebars.escapeExpression(text);
}); 