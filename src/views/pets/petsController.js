import { get } from "../../helpers/api.js";
import { cargarTiposDocumento } from "../../helpers/cargarTiposDocumento.js";
import { crearFila } from "../../helpers/crearFila.js";

export const petsController = async () => {
  const response = await get("mascotas");

  console.log(response);

  if (!response.success) {
    await error(response.message);
  }

  const tbody = document.querySelector("#pets .table__body");

  response.data.forEach(
    ({ id, nombre, especie, raza, dueno, telefono, ultimo_antecedente }) => {
      const row = crearFila([
        id,
        nombre,
        especie,
        raza,
        dueno,
        telefono,
        ultimo_antecedente ?? "Sin registros",
      ]);
      tbody.append(row);
    }
  );

  const tablePets = document.querySelector("#pets");
  tablePets.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idCliente = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", idCliente);
      location.hash = `#/mascotas/perfil/id=${idCliente}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
