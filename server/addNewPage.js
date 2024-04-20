const tableSection = document.getElementById("tableSection");
const chartSection = document.getElementById("chartSection");
const sampleProfileSection = document.getElementById("sampleProfileSection");

let idInt = 0;

export function addNewPage(tableTitle, isSampleProfile) {
  const section = document.createElement("section");
  section.classList.add("container");

  const a4 = document.createElement("div");
  a4.classList.add("a4");

  const info = document.createElement("div");
  info.classList.add("infoBottom");

  const textInfo = document.createElement("p");
  textInfo.innerHTML =
    "CNPJ Nº 10956929/0001-42 | Avenida Manoel Tavares, 700 – Sala 103 –  Empresarial Vila Bianco | Jardim Tavares – Campina Grande. PB – CEP 58402-068 <br/> (83) 9 9979.0891 - 9 9308.5727";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add('delete-button')
  deleteButton.classList.add('material-icons')
  deleteButton.innerText = "delete"

  a4.appendChild(deleteButton);

  info.appendChild(textInfo);

  a4.appendChild(info);

  const inputTitle = document.createElement('div');
  inputTitle.setAttribute('contenteditable', 'True');
  inputTitle.classList.add('multiline-input');
  inputTitle.classList.add('text-center');
  inputTitle.innerText = tableTitle;

  a4.appendChild(inputTitle);

  a4.setAttribute('id', 'id_' + idInt + 1);
  idInt++

  section.appendChild(a4);

  if (isSampleProfile) {
    return sampleProfileSection
  } else {
    tableSection.appendChild(section);
    return a4
  }
};

tableSection.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-button')) {
    const pageToRemoveId = event.target.closest('.a4').id;
    const pageToRemove = document.getElementById(pageToRemoveId);
    if (pageToRemove) {
      pageToRemove.remove();
    }
  }
});

chartSection.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-button')) {
    const pageToRemoveId = event.target.closest('.a4').id;
    const pageToRemove = document.getElementById(pageToRemoveId);
    if (pageToRemove) {
      pageToRemove.remove();
    }
  }
});
