/**
 * Crea una fila de tabla (<tr>) con celdas (<td>) a partir de un arreglo de datos.
 *
 * @param {Array<any>} datos - Arreglo de valores o nodos HTML. El primer elemento se usa como data-id de la fila.
 * @returns {HTMLTableRowElement} Fila de tabla con celdas generadas.
 */
export const crearFila = (datos = []) => {
  const fila = document.createElement("tr");
  fila.classList.add("table__row");

  // Usar el primer elemento como identificador de la fila
  fila.setAttribute("data-id", datos[0]);

  datos.forEach((dato) => {
    const celda = document.createElement("td");
    celda.classList.add("table__cell");

    // Si es un nodo HTML, agregarlo como hijo; si no, insertarlo como texto
    if (dato instanceof Node) {
      celda.appendChild(dato);
    } else {
      celda.textContent = dato;
    }

    fila.appendChild(celda);
  });

  return fila;
};
