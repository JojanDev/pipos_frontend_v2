export const crearFila = (datos = []) => {
  const fila = document.createElement("tr");
  fila.classList.add("table__row");
  fila.setAttribute("data-id", datos[0]);

  datos.forEach((dato) => {
    const celda = document.createElement("td");
    celda.classList.add("table__cell");

    if (dato instanceof Node) {
      celda.appendChild(dato); // Si es un elemento HTML
    } else {
      celda.textContent = dato; // Si es texto plano
    }

    fila.appendChild(celda);
  });

  return fila;
};
