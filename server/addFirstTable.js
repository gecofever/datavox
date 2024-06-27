import { addNewPage } from "./addNewPage.js";
import { addSecondTable } from "./addSecondTable.js";

let tableCounter = 1;

export function addFirstTable(data, options, subheader, tableTitle, valuesArray, isSecondTable, isSampleProfile) {
  const maxRowsPerPage = 20;
  console.log(tableCounter)

  let rowsProcessed = 0;
  let currentPage = 1;
  let tableNumberTitle = `Tabela ${tableCounter}: ${tableTitle}`;

  const columnTitles = [
    'Discriminação',
    'Total',
    'MAS', 'FEM',
    '16 a 24', '25 a 34', '35 a 44', '45 a 59', '60 e mais',
    'Analfabeto/Lê e Escreve', 'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior',
    'Até 1 S.M.', 'De 1 a 3 S.M.', 'Mais de 3 S.M.'
  ];

  while (rowsProcessed < data.length) {
    const newA4Page = addNewPage(tableNumberTitle, isSampleProfile);

    const newPage = document.createElement('div');
    newPage.classList.add('page');

    const newTable = document.createElement('table');
    newTable.classList.add('table');

    const thead = document.createElement('thead');
    thead.classList.add('tableHead');

    const firstRow = document.createElement('tr');

    const headers = [
      { text: 'Discriminação', rowspan: 2 },
      { text: 'Total', rowspan: 2 },
      { text: 'Sexo', colspan: 2 },
      { text: 'Faixa etária', colspan: 5 },
      { text: 'Escolaridade', colspan: 4 },
      { text: 'Renda familiar', colspan: 3 },
    ];

    headers.forEach((headerData) => {
      const th = document.createElement('th');
      th.textContent = headerData.text;

      if (headerData.rowspan) {
        th.setAttribute('rowspan', headerData.rowspan);
      }

      if (headerData.colspan) {
        th.setAttribute('colspan', headerData.colspan);
      }

      firstRow.appendChild(th);
    });

    const secondRow = document.createElement('tr');
    secondRow.classList.add('headerChild');

    columnTitles.slice(2).forEach((columnTitle) => {
      const th = document.createElement('th');
      th.textContent = columnTitle;
      secondRow.appendChild(th);
    });

    thead.appendChild(firstRow);
    thead.appendChild(secondRow);

    newTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.classList.add('tableBody');

    let pageData = data.slice(rowsProcessed, rowsProcessed + maxRowsPerPage);
    let pageOptions = options.slice(rowsProcessed, rowsProcessed + maxRowsPerPage);

    if (isSampleProfile) {
      if (pageData.length > 2) {
        pageData = pageData.slice(-2); // Mantém apenas as duas últimas linhas
        pageOptions = pageOptions.slice(-2); // Mantém apenas as duas últimas linhas
      }
      pageOptions[0] = 'Absolutos';
      pageOptions[1] = 'Percentuais (%)';
    }

    for (let i = 0; i < pageData.length; i++) {
      const row = pageData[i];
      const tr = document.createElement('tr');

      const td = document.createElement('td');

      const optionText =
        pageOptions[i] === 'Soma' || pageOptions[i] === 'SOMA' || pageOptions[i] === 'soma' ? 'Total' : pageOptions[i];

      td.textContent = optionText;
      tr.appendChild(td);

      for (let j = 1; j <= 15; j++) {
        let value = 0;
        const td = document.createElement('td');
        const factor = 10;

        if (isSampleProfile) {
          if (i === 1) { // Segunda linha - Percentuais (%)
            const _value = row[j] !== null
              ? (row[j] === 0 ? '0,0' : (Math.round((parseFloat(row[j].toString().replace(',', '.'))) * factor) / factor).toFixed(1))
              : 'N/A';
            value = _value.toString().replace('.', ',');
          } else if (i === 0) { // Primeira linha - Absolutos
            const _value = row[j] !== null
              ? (row[j] === 0 ? '0' : Math.round(parseFloat(row[j].toString().replace(',', '.'))).toString())
              : 'N/A';
            value = _value.toString().replace('.', ',');
          } else {
            const _value = row[j] !== null
              ? (row[j] === 0 ? '0' : row[j].toString())
              : 'N/A';
            value = _value.toString().replace('.', ',');
          }
        } else {
          const _value = row[j] !== null
            ? (row[j] === 0 ? '0,0' : row[j].toString().replace('.', ','))
            : 'N/A';

          if (!isNaN(parseFloat(_value))) {
            const val = parseFloat(_value.replace(',', '.')).toFixed(1);
            value = val.toString().replace('.', ',');
          } else {
            value = _value;
          }
        }

        td.textContent = value;
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    const lastRow = tbody.lastElementChild;
    const firstCellText = lastRow.firstElementChild.textContent
      .trim()
      .toLocaleLowerCase();

    if (firstCellText === 'total') {
      lastRow.classList.add('totalRow');
    }

    newTable.appendChild(tbody);
    newA4Page.appendChild(newTable);

    rowsProcessed += maxRowsPerPage;
    currentPage++;

    if (rowsProcessed >= data.length && valuesArray[1] > 0) {
      addSecondTable(data, subheader, tableNumberTitle, valuesArray, isSecondTable, isSampleProfile);
    }

    if (!isSampleProfile) {
      tableCounter++;
    }
  }
}

export function decrementTableCounter() {
  if (tableCounter > 1) {
    tableCounter--;
  }
}
