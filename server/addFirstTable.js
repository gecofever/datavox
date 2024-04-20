import { addNewPage } from "./addNewPage.js"
import { addSecondTable } from "./addSecondTable.js"

export function addFirstTable(data, options, subheader, tableTitle, valuesArray, isSecondTable, isSampleProfile) {
  const maxRowsPerPage = 15;

  let rowsProcessed = 0;
  let currentPage = 1;

  while (rowsProcessed < data.length) {
    const newA4Page = addNewPage(tableTitle, isSampleProfile);

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

    const columnMapping = {
      Opção: 'Discriminação',
      Total: 'Total',
      Masculino: 'MAS',
      Feminino: 'FEM',
      '16 a 24 anos': '16 a 24',
      '25 a 34 anos': '25 a 34',
      '35 a 44 anos': '35 a 44',
      '45 a 59 anos': '45 a 59',
      '60 anos ou mais': '60 e mais',
      'Até 5º Ano do ensino fundamental': 'Até 5º Ano',
      'Do 6º ao 9º Ano do ensino fundamental': 'Do 6º a 9º Ano',
      'Ensino médio completo ou incompleto': 'Ensino Médio',
      'Superior completo ou incompleto': 'Ensino Superior',
      'Até R$ 1.320,00 (1 S.M)': 'Até 1 S.M.',
      'De R$ 1.320,01 a R$ 3.960,00 (De 1 a 3 S.M)': 'De 1 a 3 S.M.',
      'Mais de R$ 3 960,01 (Mais de 3 S.M)': 'Mais de 3 S.M.',
    };

    subheader.slice(2, 16).forEach((subheaderText) => {
      const th = document.createElement('th');
      const mappedSubheader = columnMapping[subheaderText] || subheaderText;
      th.textContent = mappedSubheader;
      secondRow.appendChild(th);
    });

    thead.appendChild(firstRow);
    thead.appendChild(secondRow);

    newTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.classList.add('tableBody');

    const pageData = data.slice(rowsProcessed, rowsProcessed + maxRowsPerPage);
    const pageOptions = options.slice(rowsProcessed, rowsProcessed + maxRowsPerPage);

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
        const factor = 10

        if (isSampleProfile) {
          const _value = row[j] !== null
            ? (row[j] === 0 ? '0.0' : (Math.round((parseFloat(row[j].toString().replace(',', '.'))) * factor) / factor))
            : 'N/A';
          value = _value.toString().replace('.', ',')
        } else {
          value = row[j] !== null
            ? (row[j] === 0 ? '0,0' : row[j].toString().replace('.', ','))
            : 'N/A';
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

    if (rowsProcessed >= data.length) {
      addSecondTable(data, subheader, tableTitle, valuesArray, isSecondTable, isSampleProfile)
    }
  }
}