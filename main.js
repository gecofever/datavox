import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { addNewPage } from './server/addNewPage.js'
import { addNewChartPage } from './server/addNewPage.js'
import { removePage } from './server/removePage.js'
import { removeChart } from './server/removeChart.js'
import { saveChanges } from './server/saveChanges.js'

const openFormButton = document.getElementById('openForm')
const addPageButton = document.getElementById('addPage')
const chartOptions = document.getElementById('chart-options')

const removePageButton = document.getElementById('removePage')
const barChartButton = document.getElementById('bar-chart')
const pieChartButton = document.getElementById('pie-chart')

const closeTableOptions = document.getElementById('close-table-options')
const closeChartOptions = document.getElementById('close-chart-options')

const saveChangesButton = document.getElementById('saveChanges')
const closeFormButton = document.getElementById('closeForm')
const floatingForm = document.getElementById('floatingForm')
const tableOptions = document.getElementById('table-options')
const tableButton1 = document.getElementById('model1')
const tableButton2 = document.getElementById('model2')
const addSecondTableButton = document.getElementById('add-second-table')

const table2 = document.getElementById('table2')

tableButton2.addEventListener('click', () => {
  table2.classList.remove('hidden')
})

addSecondTableButton.addEventListener('click', () => {
  if (radioButtons[0].checked) {
    fileInput.isBar = true
    fileInput.isPie = false
  }

  if (radioButtons[1].checked) {
    fileInput.isBar = false
    fileInput.isPie = true
  }

  fileInput.isSecondTable = true
  fileInput.click()
})

const getNumberOfColumnsFromTables = () => {
  const inputElements = document.querySelectorAll('#number-of-columns')
  const valuesArray = Array.from(inputElements, input =>
    input.value !== '' ? Number(input.value) : 0
  )
  console.log(valuesArray)
  return valuesArray
}

openFormButton.addEventListener('click', () => {
  floatingForm.classList.remove('hidden')
})

closeFormButton.addEventListener('click', () => {
  floatingForm.classList.add('hidden')
})

closeTableOptions.addEventListener('click', () => {
  tableOptions.classList.add('hidden')
  table2.classList.add('hidden')
})

closeChartOptions.addEventListener('click', () => {
  chartOptions.classList.add('hidden')
})

const radioButtons = document.getElementsByName("chartType")

saveChangesButton.addEventListener('click', saveChanges)

removePageButton.addEventListener('click', () => {
  removePage()
  removeChart()
})

const fileInput = document.getElementById('fileInput')

function addTableFromWorkbook(buffer, isSecondTable) {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
  });

  const tableTitle = data.shift()[0];
  const dataArray = data.map((object) => Object.values(object));
  const subheader = dataArray[1];
  dataArray.shift();
  dataArray.shift();

  const filteredData = dataArray.filter((row) =>
    row.some((value) => value !== null),
  );

  const valuesArray = getNumberOfColumnsFromTables()

  const options = filteredData.map((row) => row[0]);

  const container = criaTitulo(tableTitle)

  addTable(container, filteredData, options, subheader, tableTitle, valuesArray, isSecondTable);
}

const criaTitulo = (tableTitle) => {
  const a4 = addNewPage();

  const inputTitle = document.createElement('input');
  inputTitle.setAttribute('placeholder', 'Título da tabela');
  inputTitle.setAttribute('type', 'text');
  inputTitle.classList.add('tableTitle');
  inputTitle.value = tableTitle;

  const inputSubtitle = document.createElement('input');
  inputSubtitle.setAttribute('type', 'text');
  inputSubtitle.classList.add('tableSubtitle');

  a4.appendChild(inputTitle);
  a4.appendChild(inputSubtitle);

  return a4
}

fileInput.addEventListener('change', function (event) {
  const files = event.target.files;

  if (files) {
    // Itera sobre cada arquivo selecionado
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = function (e) {
        const buffer = e.target.result;

        // Adiciona a tabela do arquivo
        addTableAndChart(buffer);
      };

      reader.readAsArrayBuffer(file);
    }

    // Limpa o valor do input file para permitir a seleção de novos arquivos
    fileInput.value = '';
  }
});

function addTableAndChart(buffer) {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });

  const isSecondTable = fileInput.isSecondTable;
  const isBar = fileInput.isBar
  const isPie = fileInput.isPie

  workbook.SheetNames.forEach((sheetName) => {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
    });

    // Adicione sua lógica aqui para processar cada tabela e gráfico
    const dataArray = data.map((object) => Object.values(object));
    const tableTitle = data.shift()[0];
    addTableFromWorkbook(buffer, isSecondTable);
    addChart(buffer, isBar, isPie);
  });
}

const addChart = (buffer, isBar, isPie) => {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
  });

  const dataArray = data.map((object) => Object.values(object));

  const tableTitle = data.shift()[0];

  const opcoes = dataArray.map(row => row[0]);
  opcoes.shift();
  opcoes.shift();
  opcoes.shift();
  opcoes.pop();

  const pontos = dataArray.map(row => row[1]);
  pontos.shift();
  pontos.shift();
  pontos.shift();
  pontos.pop();

  if (isBar) {
    const type = 'bar'
    addBarChart(opcoes, pontos, tableTitle, type)
  }

  if (isPie) {
    const type = 'doughnut'
    addBarChart(opcoes, pontos, tableTitle, type)
  }
}

const addBarChart = (opcoes, pontos, tableTitle, type) => {

  const inputTitle = document.createElement('input');
  inputTitle.setAttribute('placeholder', 'Título da tabela');
  inputTitle.setAttribute('type', 'text');
  inputTitle.classList.add('tableTitle');
  inputTitle.value = tableTitle;

  const data = opcoes.map((option, index) => {
    const totalString = pontos[index] !== undefined ? pontos[index].toString() : '0.0';
    const total = parseFloat(totalString.replace(/,/g, '.'));
    return {
      option,
      total,
    };
  }).filter(row => row.option !== undefined);

  // Criando o elemento canvas
  const canvasElement = document.createElement("canvas");
  canvasElement.id = "chart";
  canvasElement.width = 1000;
  canvasElement.height = 600;

  // Criando o elemento div
  const divElement = document.createElement("div");
  divElement.style.width = "1000px";
  divElement.style.height = "600px";
  divElement.style.display = "flex";
  divElement.style.justifyContent = "center";
  divElement.style.alignItems = "center";
  divElement.appendChild(canvasElement);

  const datalabelsConfig = type === 'bar'
    ? {
      color: '#000',
      anchor: 'end',
      align: 'end',
    }
    : {
      color: '#fff'
    }

  let backgroundColors;
  let color;
  let width;
  if (type === 'bar') {
    backgroundColors = ['rgba(224, 30, 54, 0.7)'],
      color = '#393F49',
      width = 1
  } else {
    backgroundColors = ['#E01E36', '#B8122B', '#9F122C'];
  }

  new Chart(canvasElement, {
    type: type,
    data: {
      labels: data.map((row) => row.option),
      datasets: [
        {
          label: tableTitle,
          data: data.map((row) => row.total),
          backgroundColor: backgroundColors,
          borderColor: color,
          borderWidth: width,
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: {
        datalabels: datalabelsConfig,
        legend: {
          display: false,
        }
      },
    },
    plugins: [ChartDataLabels],

  });


  const section = document.createElement("section");
  section.classList.add("container");

  const a4 = addNewChartPage();

  a4.appendChild(inputTitle)
  a4.appendChild(divElement)

  section.appendChild(a4);


  const chartSection = document.getElementById('chartSection')
  chartSection.appendChild(section)

}

addPageButton.addEventListener('click', () => {
  tableOptions.classList.remove('hidden')
})

tableButton1.addEventListener('click', () => {
  if (radioButtons[0].checked) {
    fileInput.isBar = true
    fileInput.isPie = false
  }

  if (radioButtons[1].checked) {
    fileInput.isBar = false
    fileInput.isPie = true
  }

  fileInput.isSecondTable = false
  fileInput.click()
})

function addTable(container, data, options, subheader, tableTitle, valuesArray, isSecondTable) {
  const table = document.createElement('table')
  table.classList.add('table')

  const thead = document.createElement('thead')
  thead.classList.add('tableHead')

  const firstRow = document.createElement('tr')

  const headers = [
    { text: 'Discriminação', rowspan: 2 },
    { text: 'Total', rowspan: 2 },
    { text: 'Sexo', colspan: 2 },
    { text: 'Faixa etária', colspan: 5 },
    { text: 'Escolaridade', colspan: 4 },
    { text: 'Renda familiar', colspan: 3 },
  ]

  headers.forEach((headerData) => {
    const th = document.createElement('th')
    th.textContent = headerData.text

    if (headerData.rowspan) {
      th.setAttribute('rowspan', headerData.rowspan)
    }

    if (headerData.colspan) {
      th.setAttribute('colspan', headerData.colspan)
    }

    firstRow.appendChild(th)
  })

  const secondRow = document.createElement('tr')
  secondRow.classList.add('headerChild')

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
  }

  // Adiciona os subheaders dinamicamente até a coluna 16
  subheader.slice(2, 16).forEach((subheaderText) => {
    const th = document.createElement('th')
    const mappedSubheader = columnMapping[subheaderText] || subheaderText
    th.textContent = mappedSubheader
    secondRow.appendChild(th)
  })

  thead.appendChild(firstRow)
  thead.appendChild(secondRow)

  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  tbody.classList.add('tableBody')

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const tr = document.createElement('tr')

    const td = document.createElement('td')

    const optionText =
      options[i].toLowerCase() === 'soma' ? 'Total' : options[i]

    td.textContent = optionText
    tr.appendChild(td)

    for (let j = 1; j <= 15; j++) {
      const td = document.createElement('td')
      const value = row[j] !== null ? (row[j] === 0 ? '0.0' : row[j]) : 'N/A'
      td.textContent = value

      tr.appendChild(td)
    }

    tbody.appendChild(tr)
  }

  const lastRow = tbody.lastElementChild
  const firstCellText = lastRow.firstElementChild.textContent
    .trim()
    .toLocaleLowerCase()

  if (firstCellText === 'total') {
    lastRow.classList.add('totalRow')
  }

  table.appendChild(tbody)
  container.appendChild(table)

  if (options.length > 20) {
    table.classList.add('noPadding')
  }

  const container2 = criaTitulo(tableTitle)

  addSecondTable(container2, data, options, subheader, tableTitle, valuesArray, isSecondTable)
}

function addSecondTable(container, data, options, subheader, tableTitle, valuesArray, isSecondTable) {
  const table = document.createElement('table')
  table.classList.add('table')

  const thead = document.createElement('thead')
  thead.classList.add('tableHead')

  const firstRow = document.createElement('tr')

  const hasUrbana = subheader.includes('Urbana')
  const hasRural = subheader.includes('Rural')

  const zoneColspan = (hasUrbana ? 1 : 0) + (hasRural ? 1 : 0)

  const headers = [
    { text: 'Discriminação', rowspan: 2 },
    { text: 'Zona', colspan: zoneColspan },
    { text: 'Localidades rurais', colspan: subheader.length },
  ]

  headers.forEach((headerData) => {
    const th = document.createElement('th')

    if (headerData.rowspan) {
      th.setAttribute('rowspan', headerData.rowspan)
    }

    if (headerData.colspan) {
      th.setAttribute('colspan', headerData.colspan)
    }

    const editableInput = document.createElement('input')
    editableInput.setAttribute('type', 'text')
    editableInput.value = headerData.text
    editableInput.classList.add('editableHeader')

    th.appendChild(editableInput)
    firstRow.appendChild(th)
  })

  const secondRow = document.createElement('tr')
  secondRow.classList.add('headerChild')

  if (isSecondTable) {
    subheader.forEach((subheaderText, index) => {
      if (index > valuesArray[0] && index <= ((valuesArray[0]) + (valuesArray[1]))) {
        const th = document.createElement('th');
        th.textContent = subheaderText;
        secondRow.appendChild(th);
      }
    });
  } else {

    // Adiciona os subheader dinamicamente a partir da coluna 17
    subheader.slice(16).forEach((subheaderText) => {
      const th = document.createElement('th')
      th.textContent = subheaderText
      secondRow.appendChild(th)
    })
  }

  thead.appendChild(firstRow)
  thead.appendChild(secondRow)

  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  tbody.classList.add('tableBody')

  for (const row of data) {
    const tr = document.createElement('tr')

    // Adiciona as opções na primeira coluna
    const td = document.createElement('td')
    const options =
      row[0] !== null
        ? row[0].trim().toLowerCase() === 'soma'
          ? 'Total'
          : row[0]
        : 'N/A'

    td.textContent = options
    tr.appendChild(td)

    if (isSecondTable) {
      row.forEach((subheaderText, index) => {
        if (index > valuesArray[0] && index <= ((valuesArray[0]) + (valuesArray[1]))) {

          const td = document.createElement('td')
          td.textContent = subheaderText !== null ? (subheaderText === 0 ? '0.0' : subheaderText) : 'N/A'
          tr.appendChild(td)
        }
      });
    } else {
      // Adiciona os valores a partir da coluna 17
      row.slice(16).forEach((value) => {
        const td = document.createElement('td')
        td.textContent = value !== null ? (value === 0 ? '0.0' : value) : 'N/A'

        tr.appendChild(td)
      })
    }

    tbody.appendChild(tr)
  }

  const lastRow = tbody.lastElementChild
  const firstCellText = lastRow.firstElementChild.textContent
    .trim()
    .toLocaleLowerCase()

  if (firstCellText === 'total') {
    lastRow.classList.add('totalRow')
  }

  table.appendChild(tbody)
  container.appendChild(table)

  if (options.length > 20) {
    table.classList.add('noPadding')
  }

  if (isSecondTable) {
    const container2 = criaTitulo(tableTitle)
    addExtraTable(container2, data, options, subheader, tableTitle, valuesArray, isSecondTable)
  }
}

function addExtraTable(container, data, options, subheader, tableTitle, valuesArray, isSecondTable) {
  const table = document.createElement('table')
  table.classList.add('table')

  const thead = document.createElement('thead')
  thead.classList.add('tableHead')

  const firstRow = document.createElement('tr')

  const headers = [
    { text: 'Discriminação', rowspan: 2 },
    { text: 'Título', colspan: subheader.length },
  ]

  headers.forEach((headerData) => {
    const th = document.createElement('th')

    if (headerData.rowspan) {
      th.setAttribute('rowspan', headerData.rowspan)
    }

    if (headerData.colspan) {
      th.setAttribute('colspan', headerData.colspan)
    }

    const editableInput = document.createElement('input')
    editableInput.setAttribute('type', 'text')
    editableInput.value = headerData.text
    editableInput.classList.add('editableHeader')

    th.appendChild(editableInput)
    firstRow.appendChild(th)
  })

  const secondRow = document.createElement('tr')
  secondRow.classList.add('headerChild')

  subheader.forEach((subheaderText, index) => {
    const colunasAnteriores = valuesArray.slice(0, 2).reduce((total, colunas) => total + colunas, 0);

    if (index > colunasAnteriores && index <= (colunasAnteriores + valuesArray[2])) {
      const th = document.createElement('th');
      th.textContent = subheaderText;
      secondRow.appendChild(th);
    }
  });

  thead.appendChild(firstRow)
  thead.appendChild(secondRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  tbody.classList.add('tableBody')

  for (const row of data) {
    const tr = document.createElement('tr')

    // Adiciona as opções na primeira coluna
    const td = document.createElement('td')
    const options =
      row[0] !== null
        ? row[0].trim().toLowerCase() === 'soma'
          ? 'Total'
          : row[0]
        : 'N/A'

    td.textContent = options
    tr.appendChild(td)

    row.forEach((subheaderText, index) => {
      const colunasAnteriores = valuesArray.slice(0, 2).reduce((total, colunas) => total + colunas, 0);
      if (index > colunasAnteriores && index <= (colunasAnteriores + valuesArray[2])) {

        const td = document.createElement('td')
        td.textContent = subheaderText !== null ? (subheaderText === 0 ? '0.0' : subheaderText) : 'N/A'
        tr.appendChild(td)
      }
    });

    tbody.appendChild(tr)
  }

  const lastRow = tbody.lastElementChild
  const firstCellText = lastRow.firstElementChild.textContent
    .trim()
    .toLocaleLowerCase()

  if (firstCellText === 'total') {
    lastRow.classList.add('totalRow')
  }

  table.appendChild(tbody)
  container.appendChild(table)

  if (options.length > 20) {
    table.classList.add('noPadding')
  }

  container.appendChild(table)

  if (valuesArray[4] !== 0) {
    return
  }

  const container2 = criaTitulo(tableTitle)
  addExtraTable2(container2, data, options, subheader, valuesArray, isSecondTable)
}

function addExtraTable2(container, data, options, subheader, valuesArray, isSecondTable) {
  const table = document.createElement('table')
  table.classList.add('table')

  const thead = document.createElement('thead')
  thead.classList.add('tableHead')

  const firstRow = document.createElement('tr')

  const headers = [
    { text: 'Discriminação', rowspan: 2 },
    { text: 'Teste', colspan: subheader.length },
  ]

  headers.forEach((headerData) => {
    const th = document.createElement('th')

    if (headerData.rowspan) {
      th.setAttribute('rowspan', headerData.rowspan)
    }

    if (headerData.colspan) {
      th.setAttribute('colspan', headerData.colspan)
    }

    const editableInput = document.createElement('input')
    editableInput.setAttribute('type', 'text')
    editableInput.value = headerData.text
    editableInput.classList.add('editableHeader')

    th.appendChild(editableInput)
    firstRow.appendChild(th)
  })

  const secondRow = document.createElement('tr')
  secondRow.classList.add('headerChild')

  subheader.forEach((subheaderText, index) => {
    const colunasAnteriores = valuesArray.slice(0, 3).reduce((total, colunas) => total + colunas, 0);

    if (index > colunasAnteriores && index <= (colunasAnteriores + valuesArray[3])) {
      const th = document.createElement('th');
      th.textContent = subheaderText;
      secondRow.appendChild(th);
    }
  });

  thead.appendChild(firstRow)
  thead.appendChild(secondRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  tbody.classList.add('tableBody')

  for (const row of data) {
    const tr = document.createElement('tr')

    // Adiciona as opções na primeira coluna
    const td = document.createElement('td')
    const options =
      row[0] !== null
        ? row[0].trim().toLowerCase() === 'soma'
          ? 'Total'
          : row[0]
        : 'N/A'

    td.textContent = options
    tr.appendChild(td)

    row.forEach((subheaderText, index) => {
      const colunasAnteriores = valuesArray.slice(0, 3).reduce((total, colunas) => total + colunas, 0);
      if (index > colunasAnteriores && index <= (colunasAnteriores + valuesArray[3])) {

        const td = document.createElement('td')
        td.textContent = subheaderText !== null ? (subheaderText === 0 ? '0.0' : subheaderText) : 'N/A'
        tr.appendChild(td)
      }
    });

    tbody.appendChild(tr)
  }

  const lastRow = tbody.lastElementChild
  const firstCellText = lastRow.firstElementChild.textContent
    .trim()
    .toLocaleLowerCase()

  if (firstCellText === 'total') {
    lastRow.classList.add('totalRow')
  }

  table.appendChild(tbody)
  container.appendChild(table)

  if (options.length > 20) {
    table.classList.add('noPadding')
  }

  container.appendChild(table)
}
