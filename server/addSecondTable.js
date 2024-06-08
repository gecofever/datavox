import { addNewPage } from "./addNewPage.js";
import { addExtraTable } from "./addExtraTable.js";

export function addSecondTable(data, subheader, tableTitle, valuesArray, isSecondTable, isSampleProfile) {
  const maxRowsPerPage = 20;

  let rowsProcessed = 0;
  let currentPage = 1;

  while (rowsProcessed < data.length) {
    const newA4Page = addNewPage(tableTitle, isSampleProfile);

    const newTable = document.createElement('table');
    newTable.classList.add('table');

    const thead = document.createElement('thead');
    thead.classList.add('tableHead');

    const firstRow = document.createElement('tr');

    const hasUrbana = subheader.includes('Urbana');
    const hasRural = subheader.includes('Rural');

    const zoneColspan = (hasUrbana ? 1 : 0) + (hasRural ? 1 : 0);

    const ruralLocations = isSampleProfile ? 'Bairros / Sítios' : 'Localidades rurais';

    const headers = [
      { text: 'Discriminação', rowspan: 2 },
      { text: 'Zona', colspan: zoneColspan },
      { text: ruralLocations, colspan: subheader.length },
    ];

    if (!hasRural && !hasUrbana) {
      headers.splice(1, 1);
    }

    if (hasRural && !hasUrbana) {
      headers[1].text = 'Total Rural';
      headers[1].rowspan = 2;
    }

    if (hasUrbana && !hasRural) {
      headers[1].text = 'Total Urbano';
      headers[1].rowspan = 2;
    }

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

    if (isSecondTable) {
      subheader.forEach((subheaderText, index) => {
        if (index > valuesArray[0] && index <= ((valuesArray[0]) + (valuesArray[1]))) {
          const th = document.createElement('th');
          th.textContent = subheaderText;
          secondRow.appendChild(th);
        }
      });
    } else {
      const subheadersQuantity = () => {
        if ((!hasRural && hasUrbana) || (hasRural && !hasUrbana)) {
          return 17;
        } else {
          return 16;
        }
      };

      const quantity = subheadersQuantity();
      subheader.slice(quantity).forEach((subheaderText) => {
        const th = document.createElement('th');
        th.textContent = subheaderText;
        secondRow.appendChild(th);
      });
    }

    thead.appendChild(firstRow);
    thead.appendChild(secondRow);

    newTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.classList.add('tableBody');

    let pageData = data.slice(rowsProcessed, rowsProcessed + maxRowsPerPage);

    if (isSampleProfile) {
      if (pageData.length > 2) {
        pageData = pageData.slice(-2); // Mantém apenas as duas últimas linhas
      }
      pageData[0][0] = 'Absolutos';
      pageData[1][0] = 'Percentuais (%)';
    }

    for (const [rowIndex, row] of pageData.entries()) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      const options =
        row[0] !== null
          ? row[0] === 'soma' || row[0] === 'SOMA' || row[0] === 'Soma'
            ? 'Total'
            : row[0]
          : 'N/A';

      td.textContent = options;
      tr.appendChild(td);

      if (isSecondTable) {
        row.forEach((value, index) => {
          if (index > valuesArray[0] && index <= ((valuesArray[0]) + (valuesArray[1]))) {
            const td = document.createElement('td');
            const factor = 10;
            if (isSampleProfile) {
              let formattedValue;
              if (rowIndex === 1) { // Percentuais (%)
                formattedValue = value !== null
                  ? (value === 0 ? '0,0' : (Math.round(parseFloat(value.toString().replace(',', '.')) * factor) / factor).toFixed(1))
                  : 'N/A';
              } else if (rowIndex === 0) { // Absolutos
                formattedValue = value !== null
                  ? (value === 0 ? '0' : Math.round(parseFloat(value.toString().replace(',', '.'))).toString())
                  : 'N/A';
              } else {
                formattedValue = value !== null
                  ? (value === 0 ? '0' : value.toString())
                  : 'N/A';
              }
              td.textContent = formattedValue.toString().replace('.', ',');
            } else {
              const _value = value !== null
                ? (value === 0 ? '0,0' : value.toString().replace('.', ','))
                : 'N/A';

              if (!isNaN(parseFloat(_value))) {
                const val = parseFloat(_value.replace(',', '.')).toFixed(1);
                td.textContent = val.toString().replace('.', ',');
              } else {
                td.textContent = _value;
              }
            }

            tr.appendChild(td);
          }
        });
      } else {
        row.slice(16).forEach((value) => {
          const td = document.createElement('td');
          const factor = 10;
          if (isSampleProfile) {
            let formattedValue;
            if (rowIndex === 1) { // Percentuais (%)
              formattedValue = value !== null
                ? (value === 0 ? '0,0' : (Math.round(parseFloat(value.toString().replace(',', '.')) * factor) / factor).toFixed(1))
                : 'N/A';
            } else if (rowIndex === 0) { // Absolutos
              formattedValue = value !== null
                ? (value === 0 ? '0' : Math.round(parseFloat(value.toString().replace(',', '.'))).toString())
                : 'N/A';
            } else {
              formattedValue = value !== null
                ? (value === 0 ? '0' : value.toString())
                : 'N/A';
            }
            td.textContent = formattedValue.toString().replace('.', ',');
          } else {
            const _value = value !== null
              ? (value === 0 ? '0,0' : value.toString().replace('.', ','))
              : 'N/A';

            if (!isNaN(parseFloat(_value))) {
              const val = parseFloat(_value.replace(',', '.')).toFixed(1);
              td.textContent = val.toString().replace('.', ',');
            } else {
              td.textContent = _value;
            }
          }

          tr.appendChild(td);
        });
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
  }

  if (isSecondTable) {
    for (let i = 2; i <= 10; i++) {
      if (valuesArray[i] === 0) {
        return;
      }
      addExtraTable(data, subheader, tableTitle, valuesArray, isSampleProfile, i);
    }
  }
}
