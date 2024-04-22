import { addNewPage } from "./addNewPage.js"

export function addExtraTable(data, subheader, tableTitle, valuesArray, isSampleProfile, position) {
  const maxRowsPerPage = 15;
  const colunasAnteriores = valuesArray.slice(0, position).reduce((total, colunas) => total + colunas, 0);

  let rowsProcessed = 0;

  while (rowsProcessed < data.length) {
    const newA4Page = addNewPage(tableTitle, isSampleProfile);

    const table = document.createElement('table');
    table.classList.add('table');

    const thead = document.createElement('thead');
    thead.classList.add('tableHead');

    const firstRow = document.createElement('tr');

    const headers = [
      { text: 'Discriminação', rowspan: 2 },
      { text: 'Título', colspan: subheader.length },
    ];

    headers.forEach((headerData) => {
      const th = document.createElement('th');

      if (headerData.rowspan) {
        th.setAttribute('rowspan', headerData.rowspan);
      }

      if (headerData.colspan) {
        th.setAttribute('colspan', headerData.colspan);
      }

      const editableInput = document.createElement('input');
      editableInput.setAttribute('type', 'text');
      editableInput.value = headerData.text;
      editableInput.classList.add('editableHeader');

      th.appendChild(editableInput);
      firstRow.appendChild(th);
    });

    const secondRow = document.createElement('tr');
    secondRow.classList.add('headerChild');

    subheader.forEach((subheaderText, index) => {
      if (index > colunasAnteriores && index <= (colunasAnteriores + valuesArray[position])) {
        const th = document.createElement('th');
        th.textContent = subheaderText;
        secondRow.appendChild(th);
      }
    });

    thead.appendChild(firstRow);
    thead.appendChild(secondRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.classList.add('tableBody');

    const pageData = data.slice(rowsProcessed, rowsProcessed + maxRowsPerPage);

    for (const row of pageData) {
      const tr = document.createElement('tr');

      const td = document.createElement('td');
      const options =
        row[0] !== null
          ? row[0].trim().toLowerCase() === 'soma'
            ? 'Total'
            : row[0]
          : 'N/A';

      td.textContent = options;
      tr.appendChild(td);

      row.forEach((subheaderText, index) => {
        if (index > colunasAnteriores && index <= (colunasAnteriores + valuesArray[position])) {
          const td = document.createElement('td');
          const factor = 10
          if (isSampleProfile) {
            const _value = subheaderText !== null
              ? (subheaderText === 0 ? '0,0' : Math.round(parseFloat(subheaderText.toString().replace(',', '.')) * factor) / factor)
              : 'N/A';

            td.textContent = _value.toString().replace('.', ',')
          } else {
            const _value = subheaderText !== null
              ? (subheaderText === 0 ? '0,0' : subheaderText.toString().replace('.', ','))
              : 'N/A';

            if (!isNaN(parseFloat(_value))) {
              const val = parseFloat(_value.replace(',', '.')).toFixed(1)
              td.textContent = val.toString().replace('.', ',')
            } else {
              td.textContent = _value
            }
          }

          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    const lastRow = tbody.lastElementChild;
    const firstCellText = lastRow.firstElementChild.textContent
      .trim()
      .toLocaleLowerCase();

    if (firstCellText === 'total') {
      lastRow.classList.add('totalRow');
    }

    newA4Page.appendChild(table);
    rowsProcessed += maxRowsPerPage;
  }
}
