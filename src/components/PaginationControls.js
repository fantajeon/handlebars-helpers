import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { CustomButton } from './Button';

export const createPaginationControls = (currentPage, totalPages, goToPage) => ({
  run: () => {
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

    paginationContainer.append(prevPlaceHolderHtml, pageInfoHtml, nextPlaceHolderHtml);

    setTimeout(() => {
      [
        {id: 'left-button', label: '<', disabled: currentPage === 1, onClick: () => goToPage(currentPage - 1)},
        {id: 'right-button', label: '>', disabled: currentPage === totalPages, onClick: () => goToPage(currentPage + 1)}
      ].forEach(({id, label, disabled, onClick}) => {
        const container = document.getElementById(`mui-button-${id}`);
        const root = createRoot(container);
        root.render(
          CustomButton({
            label,
            disabled,
            onClick,
            style: {
            minWidth: '40px',
              padding: '6px 12px'
            }
          })
        );
      });
    }, 0);

    return { paginationContainer };
  }
}); 