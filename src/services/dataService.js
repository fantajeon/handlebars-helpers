import Handlebars from 'handlebars';
import { createPaginationControls } from '../components/PaginationControls';

export const preprocessData = (tables, fields) => ({
  run: () => ({
    data: tables.map((table, i) => {
      const render_data = { cardId: i };
      Object.keys(fields).forEach(fieldGroup => {
        fields[fieldGroup].forEach((field, index) => {
          render_data[field.name] = (table[fieldGroup] && table[fieldGroup][index]) || undefined;
        });
      });
      return render_data;
    })
  })
});

export const initializeData = (data) => ({
  run: () => ({
    body_template: data.style.bodyTemplate.value,
    css_template: data.style.cssTemplate.value,
    tables: data.tables.DEFAULT,
    template: Handlebars.compile(data.style.bodyTemplate.value),
    vizframe: document.body,
    data_container: document.createElement('div'),
    topNEnabled: data.style.topN.options.enabled.value || false,
    pageEnabled: data.style.paged.options.enabled.value || false,
    data
  })
});

export const renderPage = (state) => ({
  run: () => {
    const { template, data_container, vizframe, processedData, pageEnabled, totalPages, currentPage, goToPage } = state;
    const iteratorMode = state.data.style.templateIteratorMode.value;
    const templateData = {
      topN: state.topN,
      pageSize: state.pageSize,
      totalPages,
      pageEnabled,
      currentPage
    };

    const html = iteratorMode === 'template'
      ? template({...templateData, items: processedData})
      : processedData.map(item => template({...templateData, item})).join('');

    data_container.innerHTML = html;

    if (pageEnabled && totalPages > 1) {
      data_container.appendChild(createPaginationControls(currentPage, totalPages, goToPage).run().paginationContainer);
    }

    vizframe.innerHTML = data_container.innerHTML;
    return state;
  }
}); 