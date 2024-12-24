'use strict';

const dscc = require('@google/dscc');
const helpers = require('./helpers/handlebarsHelpers');
const { RenderMonad } = require('./utils/RenderMonad');
const { applyStyles } = require('./services/styleService');
const { preprocessData, initializeData, renderPage } = require('./services/dataService');

// production 모드에서는 webpack.config.js의 TerserPlugin이 
// 사용되지 않는 코드를 자동으로 제거하므로 이 코드는 삭제됩니다.
// 왜냐하면 DSCC_IS_LOCAL이 false일 때는 local 변수가 사용되지 않기 때문입니다.

// write viz code here
const drawViz = async (data) => {
  console.log(data);
  RenderMonad.of(data)
    .chain(initData => initializeData(initData))
    .chain(state => {
      console.log("state", state);
      applyStyles(state.css_template);
      const topN = state.topNEnabled ? state.data.style.topN.value : state.tables.length;
      const slicedTables = state.tables.slice(0, topN);
      const allData = preprocessData(slicedTables, state.data.fields).data;
      console.log("allData", allData);
      const pageSize = state.pageEnabled ? state.data.style.pageSize.value : allData.length;
      const totalPages = Math.ceil(slicedTables.length / pageSize);

      const goToPage = (pageNum) => {
        console.log("goToPage", pageNum);
        const currentPage = Math.min(Math.max(1, pageNum), totalPages);
        const startIndex = (currentPage - 1) * pageSize;
        const processedData = allData.slice(startIndex, startIndex + pageSize);
        renderPage({...state, currentPage, processedData, pageSize, totalPages, goToPage});
      };

      if (state.pageEnabled) {
        goToPage(1);
      } else {
        renderPage({...state, currentPage: 1, processedData: allData, pageSize: allData.length, totalPages: 1});
      }
      return state;
    });
};

// renders locally
if (DSCC_IS_LOCAL) {
  const local = require('./localMessage.js');
  drawViz(local.message);
} else {
  dscc.subscribeToData(async (data) => {
    drawViz(data);
  }, {transform: dscc.objectTransform});
}
