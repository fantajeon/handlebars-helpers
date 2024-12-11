const dscc = require('@google/dscc');
const local = require('./localMessage.js');
import Handlebars from "handlebars";
import * as React from 'react';
import Button from '@mui/material/Button';
import { createRoot } from 'react-dom/client';
import { 
  List, 
  ListItem, 
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

// add json parse to handlesbards as a helper
Handlebars.registerHelper('jsonParse', function(context) {
  return JSON.parse(context);
});

const JsonTreeView = ({ data }) => {
  const [open, setOpen] = React.useState({});

  const toggleOpen = (key) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (value, key) => {
    if (typeof value === 'object' && value !== null) {
      return React.createElement(ListItem, { key: key },
        React.createElement(IconButton, {
          size: 'small',
          onClick: () => toggleOpen(key)
        }, open[key] 
          ? React.createElement(ExpandLess)
          : React.createElement(ExpandMore)
        ),
        React.createElement(ListItemText, {
          primary: key,
          secondary: `${Object.keys(value).length} items`
        }),
        React.createElement(Collapse, {
          in: open[key],
          timeout: 'auto',
          unmountOnExit: true
        },
          React.createElement(List, {
            sx: { paddingLeft: 4 }
          }, Object.entries(value).map(([k, v]) => 
            renderValue(v, `${key}-${k}`)
          ))
        )
      );
    }
    
    return React.createElement(ListItem, { key: key },
      React.createElement(ListItemText, {
        primary: key.split('-').pop(),
        secondary: value.toString()
      })
    );
  };

  return React.createElement(Paper, {
    elevation: 3,
    sx: { padding: 2, margin: 2 }
  },
    React.createElement(List, null,
      Object.entries(data).map(([key, value]) => 
        renderValue(value, key)
      )
    )
  );
};

// Handlebars helper for rendering JSON tree
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

Handlebars.registerHelper('Button', function(label, href) {
  /**
   * Reasons related to React-DOM and Material-UI:
   * 1. Material-UI uses client-side hooks like useLayoutEffect
   * 2. Server-side rendering (renderToString) doesn't support these hooks
   * 3. Client-side rendering is required for full Material-UI functionality
   */

  /**
   * DOM Timing Considerations:
   * 1. Handlebars first renders the template and inserts it into the DOM
   * 2. setTimeout ensures React component rendering occurs after DOM element creation
   * 3. This allows getElementById to find the actually existing element
   */

  /**
   * Render Order Guarantee:
   * 1. Create placeholder div first
   * 2. Wait for DOM tree insertion
   * 3. Mount React component afterward
   */


  // 고유한 ID 생성
  const buttonId = `mui-button-${Math.random().toString(36).substring(7)}`;
  
  // React 컴포넌트를 렌더링할 placeholder div 생성
  const placeholderHtml = `<div id="${buttonId}"></div>`;

  // DOM이 준비된 후 React 컴포넌트 렌더링
  setTimeout(() => {
    const container = document.getElementById(buttonId);
    if (container) {
      const root = createRoot(container);
      const button = React.createElement(Button, {
        variant: 'contained',
        color: 'primary',
        onClick: () => window.open(href, '_blank'),
        // Material-UI의 추가 props 설정 가능
        size: 'medium',
        sx: {
          margin: '8px',
          textTransform: 'none'
        }
      }, label.toString());
      
      root.render(button);
    }
  }, 0);

  return new Handlebars.SafeString(placeholderHtml);
});

Handlebars.registerHelper('link', function(text, url) {
  var url = Handlebars.escapeExpression(url),
      text = Handlebars.escapeExpression(text)

  return new Handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
});

Handlebars.registerHelper('escapeHtml', function(text) {
  return Handlebars.escapeExpression(text);
});

// write viz code here
const drawViz = (data) => {
  console.log(data);

  var body_template = data.style.bodyTemplate.value;
  console.log(body_template);

  var script_template = data.style.scriptTemplate.value;
  console.log(script_template);

  var tables = data.tables.DEFAULT;
  var template = Handlebars.compile(body_template);
  var vizframe = document.body;


  // for each table, render the template
  var data_container = document.createElement('div');
  for (var i = 0; i < tables.length; i++) {
    var table = tables[i];
    var render_data = {
      cardId: i,
    };

    // fields에서 정의된 필드 이름으로 데이터 매핑
    // 모든 필드 그룹을 순회
    Object.keys(data.fields).forEach(fieldGroup => {
      var fields = data.fields[fieldGroup];
      fields.forEach((field, index) => {
        render_data[field.name] = table[fieldGroup]?.[index];
      });
    });

    // merged render_data and table which we don't know how the data is structured
    var merged_data = Object.assign(render_data, table);
    var html = template(merged_data);
    // append the html to the vizframe
    var card_container = document.createElement('div');
    card_container.innerHTML = html;
    data_container.appendChild(card_container);
  }

  console.log(data_container);
  vizframe.innerHTML = data_container.innerHTML;

  // run the script
  var script = document.createElement('script');
  script.textContent = script_template;
  vizframe.appendChild(script);
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
