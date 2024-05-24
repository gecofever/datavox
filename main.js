import addNewChart from './server/addNewChart.js'
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
    if (!isSampleProfile) {
      addChart(buffer, isBar, isPie);
    }
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
    addNewChart(opcoes, pontos, tableTitle, type)
  }

  if (isPie) {
    const type = 'pie'
    addNewChart(opcoes, pontos, tableTitle, type)
  }
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
