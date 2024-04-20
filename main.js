import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { addNewPage } from './server/addNewPage.js'
import { saveChanges } from './server/saveChanges.js'
import { addFirstTable } from "./server/addFirstTable.js"

const openFormButton = document.getElementById('openForm')
const addPageButton = document.getElementById('addPage')
const chartOptions = document.getElementById('chart-options')

const closeTableOptions = document.getElementById('close-table-options')
const closeChartOptions = document.getElementById('close-chart-options')

const saveChangesButton = document.getElementById('saveChanges')
const closeFormButton = document.getElementById('closeForm')
const floatingForm = document.getElementById('floatingForm')
const tableOptions = document.getElementById('table-options')
const tableButton1 = document.getElementById('model1')
const tableButton2 = document.getElementById('model2')
const addSecondTableButton = document.getElementById('add-second-table')
const sampleProfileButton = document.getElementById('sample-profile')

sampleProfileButton.addEventListener('click', () => {
  tableOptions.classList.remove('hidden')
  table2.classList.remove('hidden')
  fileInput.isSampleProfile = true
})

const table2 = document.getElementById('table2')

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
  return valuesArray
}

openFormButton.addEventListener('click', () => {
  floatingForm.classList.remove('hidden')
})

closeFormButton.addEventListener('click', () => {
  floatingForm.classList.add('hidden')
})

closeChartOptions.addEventListener('click', () => {
  chartOptions.classList.add('hidden')
})

const radioButtons = document.getElementsByName("chartType")

saveChangesButton.addEventListener('click', saveChanges)

const fileInput = document.getElementById('fileInput')

fileInput.addEventListener('change', function (event) {
  const files = event.target.files;

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = function (e) {
        const buffer = e.target.result;

        addTableAndChart(buffer);
      };

      reader.readAsArrayBuffer(file);
    }

    fileInput.value = '';
  }
});

async function addTableAndChart(buffer) {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });

  const isSecondTable = fileInput.isSecondTable;
  const isBar = fileInput.isBar;
  const isPie = fileInput.isPie;
  const isSampleProfile = fileInput.isSampleProfile;

  workbook.SheetNames.forEach(async (sheetName) => {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
    });

    await addTableFromWorkbook(buffer, isSecondTable, isSampleProfile);
    addChart(buffer, isBar, isPie);
  });
}

async function addTableFromWorkbook(buffer, isSecondTable, isSampleProfile) {
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
    row.some((value) => value !== null)
  );

  const options = filteredData.map((row) => row[0]);

  const valuesArray = getNumberOfColumnsFromTables();

  await addFirstTable(filteredData, options, subheader, tableTitle, valuesArray, isSecondTable, isSampleProfile);
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
    const type = 'pie'
    addBarChart(opcoes, pontos, tableTitle, type)
  }
}

const addBarChart = (opcoes, pontos, title, type) => {
  const data = opcoes.map((option, index) => {
    const totalString = pontos[index] !== undefined ? pontos[index].toString() : '0.0';
    const total = parseFloat(totalString.replace(/,/g, '.'));
    return {
      option,
      total,
    };
  }).filter(row => row.option !== undefined);

  const canvasElement = document.createElement("canvas");
  canvasElement.id = "chart";
  canvasElement.width = 1000;
  canvasElement.height = 600;

  const divElement = document.createElement("div");
  divElement.classList.add("div-chart")
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
  let visibility = false;
  if (type === 'bar') {
    backgroundColors = ['rgba(224, 30, 54, 0.7)'],
      color = '#393F49',
      width = 1
  } else {
    backgroundColors = ['#E01E36', '#B8122B', '#9F122C'],
      visibility = true
  }

  new Chart(canvasElement, {
    type: type,
    data: {
      labels: data.map((row) => row.option),
      datasets: [
        {
          label: title,
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
          display: visibility,
        }
      },
    },
    plugins: [ChartDataLabels],
    datalabels: {
      color: '#111',
      textAlign: 'center',
    }
  });


  const section = document.createElement("section");
  section.classList.add("container");

  const a4 = addNewPage(title);

  a4.appendChild(divElement)

  section.appendChild(a4);

  const chartSection = document.getElementById('chartSection')
  chartSection.appendChild(section)
}

closeTableOptions.addEventListener('click', () => {
  tableOptions.classList.add('hidden')
  table2.classList.add('hidden')
})

addPageButton.addEventListener('click', () => {
  fileInput.isSampleProfile = false
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

tableButton2.addEventListener('click', () => {
  table2.classList.remove('hidden')
})
