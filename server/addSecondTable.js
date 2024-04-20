import { addNewPage } from "./addNewPage.js"
import { addExtraTable } from "./addExtraTable.js"

export function addSecondTable(data, subheader, tableTitle, valuesArray, isSecondTable, isSampleProfile) {
  const maxRowsPerPage = 15;

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

    const headers = [
      { text: 'Discriminação', rowspan: 2 },
      { text: 'Zona', colspan: zoneColspan },
      { text: 'Localidades rurais', colspan: subheader.length },
    ];

    if (!hasRural && !hasUrbana) {
      headers.splice(1, 1);
    }

    if (hasRural && !hasUrbana) {
      headers[1].text = 'Total Rural'
      headers[1].rowspan = 2
    }

    if (hasUrbana && !hasRural) {
      headers[1].text = 'Total Urbano'
      headers[1].rowspan = 2
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
          return 17
        } else if (!hasRural && !hasUrbana) {
          return 16
        } else {
          return 16
        }
      }

      const quantity = subheadersQuantity()
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

    const pageData = data.slice(rowsProcessed, rowsProcessed + maxRowsPerPage);

    for (const row of pageData) {
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
        row.forEach((subheaderText, index) => {
          if (index > valuesArray[0] && index <= ((valuesArray[0]) + (valuesArray[1]))) {
            const td = document.createElement('td');
            const factor = 10
            // td.textContent = subheaderText !== null
            //   ? (subheaderText === 0 ? '0.0' : Math.round(parseFloat(subheaderText.toString().replace(',', '.')) * factor) / factor)
            //   : 'N/A';
            if (isSampleProfile) {
              const _value = subheaderText !== null
                ? (subheaderText === 0 ? '0.0' : Math.round(parseFloat(subheaderText.toString().replace(',', '.')) * factor) / factor)
                : 'N/A';

              td.textContent = _value.toString().replace('.', ',')
            } else {
              td.textContent = subheaderText !== null
                ? (subheaderText === 0 ? '0,0' : subheaderText.toString().replace('.', ','))
                : 'N/A';
            }

            tr.appendChild(td);
          }
        });
      } else {
        row.slice(16).forEach((value) => {
          const td = document.createElement('td');
          const factor = 10
          // td.textContent = value !== null
          //   ? (value === 0 ? '0.0' : Math.round(parseFloat(value.toString().replace(',', '.')) * factor) / factor)
          //   : 'N/A';
          if (isSampleProfile) {
            const _value = value !== null
              ? (value === 0 ? '0.0' : Math.round(parseFloat(value.toString().replace(',', '.')) * factor) / factor)
              : 'N/A';

            td.textContent = _value.toString().replace('.', ',')
          } else {
            td.textContent = value !== null
              ? (value === 0 ? '0,0' : value.toString().replace('.', ','))
              : 'N/A';
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
        return
      }
      addExtraTable(data, subheader, tableTitle, valuesArray, isSampleProfile, i);
    }
  }
}
