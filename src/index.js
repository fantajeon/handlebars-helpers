const dscc = require('@google/dscc');
import Handlebars from "handlebars";
import * as React from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { createRoot } from 'react-dom/client';
import { 
  ExpandMore, ExpandLess
} from '@mui/icons-material';
const H = require("just-handlebars-helpers");
H.registerHelpers(Handlebars);
var helpers = require('@budibase/handlebars-helpers')({
  handlebars: Handlebars
});

// production 모드에서는 webpack.config.js의 TerserPlugin이 
// 사용되지 않는 코드를 자동으로 제거하므로 이 코드는 삭제됩니다.
// 왜냐하면 DSCC_IS_LOCAL이 false일 때는 local 변수가 사용되지 않기 때문입니다.
const local = require('./localMessage.js');

// JsonTreeView를 동적 import로 변경
const JsonTreeView = ({ data }) => {
  const [open, setOpen] = React.useState({});

  const toggleOpen = (key) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (value, key) => {
    if (value === null) {
      return React.createElement(ListItem, { key: key },
        React.createElement(ListItemText, {
          primary: key.split('-').pop(),
          secondary: "null"
        })
      );
    }

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
  var body_template = data.style.bodyTemplate.value;
  console.log(body_template);

  var css_template = data.style.cssTemplate.value;
  console.log(css_template);
  // 스타일 엘리먼트 생성
  const styleElement = document.createElement('style');
  // 스타일 엘리먼트에 CSS 내용 설정
  styleElement.textContent = css_template;
  // 스타일 엘리먼트에 id 부여 (중복 방지)
  styleElement.id = 'dscc-custom-style';
  // 기존 스타일이 있다면 제거
  const existingStyle = document.getElementById('dscc-custom-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  // 새로운 스타일 추가
  document.head.appendChild(styleElement);

  var tables = data.tables.DEFAULT;
  var template = Handlebars.compile(body_template);
  var vizframe = document.body;

  // for each table, render the template
  var data_container = document.createElement('div');
  var topNEnabled = data.style.topN.options.enabled.value || false;
  var topN = topNEnabled ? data.style.topN.value : tables.length;
  tables = tables.slice(0, topN);

  // 모든 테이블 데이터를 하나의 배열로 변환
  const allData = tables.map((table, i) => {
    // 기본 데이터 객체 생성
    const render_data = {
      cardId: i
    };

    // 필드 매핑
    Object.keys(data.fields).forEach(fieldGroup => {
      data.fields[fieldGroup].forEach((field, index) => {
        render_data[field.name] = (table[fieldGroup] && table[fieldGroup][index]) || undefined;
      });
    });

    return render_data;
  });

  let processedData = allData;
  let currentPage = 1; // 현재 페이지 상태 관리

  // 페이징 처리
  const pageEnabled = data.style.paged.options.enabled.value || false;
  const pageSize = pageEnabled ? data.style.paged.value : processedData.length;
  const totalPages = Math.ceil(tables.length / pageSize);

  // 페이지 이동 함수
  const goToPage = (pageNum) => {
    console.log("goToPage", pageNum);
    currentPage = Math.min(Math.max(1, pageNum), totalPages); // 페이지 범위 확인
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    processedData = allData.slice(startIndex, endIndex);
    renderPage();
  };

  // 페이지 렌더링 함수
  const renderPage = () => {
    const html = template({
      items: processedData,
      topN: topN,
      pageSize: pageSize,
      totalPages: totalPages,
      pageEnabled: pageEnabled,
      currentPage: currentPage
    });
    data_container.innerHTML = html;
    // 페이지네이션 컨트롤 추가
    if (pageEnabled && totalPages > 1) {
      console.log("페이지 활성화 및 총 페이지가 1보다 큼");
      const paginationContainer = document.createElement('div');
      paginationContainer.className = 'pagination';
      paginationContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      `;

      const prevPlaceHolderHtml = document.createElement('div');
      prevPlaceHolderHtml.id = "mui-button-left-button";

      const pageInfoHtml = document.createElement('span');
      pageInfoHtml.id = "mui-button-page-info";
      pageInfoHtml.textContent = `${currentPage} / ${totalPages}`;
      pageInfoHtml.style.margin = '0 10px';

      const nextPlaceHolderHtml = document.createElement('div');
      nextPlaceHolderHtml.id = "mui-button-right-button";

      paginationContainer.appendChild(prevPlaceHolderHtml);
      paginationContainer.appendChild(pageInfoHtml); 
      paginationContainer.appendChild(nextPlaceHolderHtml);
      data_container.appendChild(paginationContainer);

      setTimeout(() => {
        // 이전 페이지 버튼
        const prevContainer = document.getElementById(`mui-button-left-button`);
        const root = createRoot(prevContainer);
        const prevButton = React.createElement(Button, {
          variant: 'contained',
          color: 'primary',
          disabled: currentPage === 1,
          onClick: () => goToPage(currentPage - 1),
          style: {
            minWidth: '40px',
            padding: '6px 12px'
          }
        }, '<');

        root.render(prevButton);

        // 다음 페이지 버튼 
        const nextContainer = document.getElementById(`mui-button-right-button`);
        const nextRoot = createRoot(nextContainer);
        const nextButton = React.createElement(Button, {
          variant: 'contained',
          color: 'primary',
          disabled: currentPage === totalPages,
          onClick: () => goToPage(currentPage + 1),
          style: {
            minWidth: '40px',
            padding: '6px 12px'
          }
        }, '>');

        nextRoot.render(nextButton);
      }, 0);
    }

    vizframe.innerHTML = data_container.innerHTML;
  };

  // 초기 페이지 렌더링
  if (pageEnabled) {
    goToPage(1);
  } else {
    renderPage();
  }
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
