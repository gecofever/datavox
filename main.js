import { addNewPage } from './server/addNewPage.js'
import { removePage } from './server/removePage.js'
import { saveChanges } from './server/saveChanges.js'

const openFormButton = document.getElementById('openForm')

const addPageButton = document.getElementById('addPage')
const removePageButton = document.getElementById('removePage')
const saveChangesButton = document.getElementById('saveChanges')
const closeFormButton = document.getElementById('closeForm')
const floatingForm = document.getElementById('floatingForm')

openFormButton.addEventListener('click', () => {
  floatingForm.classList.remove('hidden')
})

closeFormButton.addEventListener('click', () => {
  floatingForm.classList.add('hidden')
})

saveChangesButton.addEventListener('click', saveChanges)

removePageButton.addEventListener('click', () => removePage())

const fileInput = document.getElementById('fileInput')

// Adiciona um ouvinte de eventos para o evento 'change' do input de arquivo
fileInput.addEventListener('change', function (event) {
  const file = event.target.files[0]

  if (file) {
    // Usa a API FileReader para ler o conteúdo do arquivo
    const reader = new FileReader()
    reader.onload = function (e) {
      const buffer = e.target.result

      const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      })

      const tableTitle = data.shift()[0]
      const dataArray = data.map((objeto) => Object.values(objeto))
      const subheader = dataArray[1]
      dataArray.shift()
      dataArray.shift()

      const filteredData = dataArray.filter((row) =>
        row.some((value) => value !== null),
      )

      const options = filteredData.map((row) => row[0])

      const a4 = addNewPage()

      const inputTitle = document.createElement('input')
      inputTitle.setAttribute('placeholder', 'Título da tabela')
      inputTitle.setAttribute('type', 'text')
      inputTitle.classList.add('tableTitle')
      inputTitle.value = tableTitle

      const inputSubtitle = document.createElement('input')
      inputSubtitle.setAttribute('type', 'text')
      inputSubtitle.classList.add('tableSubtitle')

      a4.appendChild(inputTitle)
      a4.appendChild(inputSubtitle)

      addTable(a4, filteredData, options, subheader, tableTitle)
    }

    reader.readAsArrayBuffer(file)
    fileInput.value = ''
  }
})

addPageButton.addEventListener('click', () => {
  fileInput.click()
})

function addTable(container, data, options, subheader, tableTitle) {
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

  const a4 = addNewPage()

  const inputTitle = document.createElement('input')
  inputTitle.setAttribute('placeholder', 'Título da tabela')
  inputTitle.setAttribute('type', 'text')
  inputTitle.classList.add('tableTitle')
  inputTitle.value = tableTitle

  const inputSubtitle = document.createElement('input')
  inputSubtitle.setAttribute('type', 'text')
  inputSubtitle.classList.add('tableSubtitle')

  a4.appendChild(inputTitle)
  a4.appendChild(inputSubtitle)

  addSecondTable(a4, data, options, subheader)
}

function addSecondTable(container, data, options, subheader) {
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

  // Adiciona os subheader dinamicamente a partir da coluna 17
  subheader.slice(16).forEach((subheaderText) => {
    const th = document.createElement('th')
    th.textContent = subheaderText
    secondRow.appendChild(th)
  })

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

    // Adiciona os valores a partir da coluna 17
    row.slice(16).forEach((value) => {
      const td = document.createElement('td')
      td.textContent = value !== null ? (value === 0 ? '0.0' : value) : 'N/A'

      tr.appendChild(td)
    })

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
}
