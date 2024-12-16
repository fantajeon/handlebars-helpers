const dscc = require('@google/dscc');
import './helpers/handlebarsHelpers';
import { RenderMonad } from './utils/RenderMonad';
import { applyStyles } from './services/styleService';
import { preprocessData, initializeData, renderPage } from './services/dataService';

// production 모드에서는 webpack.config.js의 TerserPlugin이 
// 사용되지 않는 코드를 자동으로 제거하므로 이 코드는 삭제됩니다.
// 왜냐하면 DSCC_IS_LOCAL이 false일 때는 local 변수가 사용되지 않기 때문입니다.
const local = require('./localMessage.js');

// write viz code here
const drawViz = (data) => {
  RenderMonad.of(data)
    .chain(initData => initializeData(initData).run())
    .chain(state => {
      applyStyles(state.css_template).run();
      const topN = state.topNEnabled ? state.data.style.topN.value : state.tables.length;
      const slicedTables = state.tables.slice(0, topN);
      const allData = preprocessData(slicedTables, state.data.fields).run().data;
      const pageSize = state.pageEnabled ? state.data.style.paged.value : allData.length;
      const totalPages = Math.ceil(slicedTables.length / pageSize);

      const goToPage = (pageNum) => {
        const currentPage = Math.min(Math.max(1, pageNum), totalPages);
        const startIndex = (currentPage - 1) * pageSize;
        const processedData = allData.slice(startIndex, startIndex + pageSize);
        renderPage({...state, currentPage, processedData, pageSize, totalPages, goToPage}).run();
      };

      if (state.pageEnabled) {
        goToPage(1);
      } else {
        renderPage({...state, currentPage: 1, processedData: allData, pageSize: allData.length, totalPages: 1}).run();
      }
      return state;
    });
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
