export const crearFila = (datos = []) => {
  const fila = document.createElement("tr");
  fila.classList.add("table__row-body");
  fila.setAttribute("data-id", datos[0]);

  datos.forEach((dato) => {
    const celda = document.createElement("td");
    celda.classList.add("table__cell-body");
    celda.textContent = dato;
    fila.appendChild(celda);
  });

  return fila;
};
