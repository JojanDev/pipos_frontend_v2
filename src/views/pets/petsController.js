import {
  get,
  cargarTiposDocumento,
  crearFila,
  convertirADiaMesAño,
  convertirFechaLocalDate,
  error,
} from "../../helpers";

export const petsController = async () => {
  const response = await get("mascotas");

  console.log(response);

  if (!response.success) {
    await error(response.message);
  }

  const tbody = document.querySelector("#pets .table__body");

  response.data.forEach(
    ({ id, nombre, raza, cliente, ultimo_registro, estado_vital }) => {
      const row = crearFila([
        id,
        nombre,
        raza.especie.nombre,
        raza.nombre,
        cliente.info.nombre,
        cliente.info.telefono,
        ultimo_registro
          ? convertirFechaLocalDate(ultimo_registro)
          : "Sin registros", //PENDIENTE HACER OBTENER LA FECHA DEL ULTIMO ANTECEDENTE
      ]);

      !estado_vital ? row.classList.add("fila-roja") : null;

      tbody.append(row);
    }
  );

  const tablePets = document.querySelector("#pets");
  tablePets.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idPet = fila.getAttribute("data-id");

      location.hash = `#/mascotas/perfil/id=${idPet}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
