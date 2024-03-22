const tableSection = document.getElementById("tableSection");

export function addNewPage() {
  const section = document.createElement("section");
  section.classList.add("container");

  const a4 = document.createElement("div");
  a4.classList.add("a4");

  const info = document.createElement("div");
  info.classList.add("infoBottom");

  const textInfo = document.createElement("p");
  textInfo.innerHTML =
    "CNPJ Nº 10956929/0001-42 | Avenida Manoel Tavares, 700 – Sala 103 –  Empresarial Vila Bianco | Jardim Tavares – Campina Grande. PB – CEP 58402-068 <br/> (83) 9 9979.0891 - 9 9308.5727";

  info.appendChild(textInfo);

  a4.appendChild(info);

  section.appendChild(a4);

  tableSection.appendChild(section);

  return a4
};

export function addNewChartPage() {
  const section = document.createElement("section");
  section.classList.add("container");

  const a4 = document.createElement("div");
  a4.classList.add("a4");
  a4.classList.add("a4Chart");

  const info = document.createElement("div");
  info.classList.add("infoBottom");

  const textInfo = document.createElement("p");
  textInfo.innerHTML =
    "CNPJ Nº 10956929/0001-42 | Avenida Manoel Tavares, 700 – Sala 103 –  Empresarial Vila Bianco | Jardim Tavares – Campina Grande. PB – CEP 58402-068 <br/> (83) 9 9979.0891 - 9 9308.5727";

  info.appendChild(textInfo);

  a4.appendChild(info);

  section.appendChild(a4);

  tableSection.appendChild(section);

  return a4
};