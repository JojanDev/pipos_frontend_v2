import { get, cargarTiposDocumento, crearFila } from "../../helpers";

export const petsController = async () => {
  const response = await get("mascotas");

  console.log(response);

  if (!response.success) {
    await error(response.message);
  }

  const tbody = document.querySelector("#pets .table__body");

  response.data.forEach(({ id, nombre, raza, cliente, ultimo_antecedente }) => {
    const row = crearFila([
      id,
      nombre,
      raza.especie.nombre,
      raza.nombre,
      cliente.info.nombre,
      cliente.info.telefono,
      ultimo_antecedente ?? "Sin registros", //PENDIENTE HACER OBTENER LA FECHA DEL ULTIMO ANTECEDENTE
    ]);
    tbody.append(row);
  });

  const tablePets = document.querySelector("#pets");
  tablePets.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idPet = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", idPet);
      location.hash = `#/mascotas/perfil/id=${idPet}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
