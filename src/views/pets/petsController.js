import { get, crearFila, convertirFechaLocalDate, error } from "../../helpers";

export const petsController = async () => {
  const tbody = document.querySelector("#pets .table__body");
  const petsResponse = await get("mascotas");

  console.log(petsResponse);

  if (!petsResponse.success) {
    await error(petsResponse.message);
  }

  petsResponse.data.forEach(
    ({
      id,
      nombre,
      raza,
      cliente,
      especie,
      telefono,
      ultimo_registro,
      estado_vital,
    }) => {
      const row = crearFila([
        id,
        nombre,
        especie,
        raza,
        cliente,
        telefono,
        ultimo_registro
          ? convertirFechaLocalDate(ultimo_registro)
          : "Sin registros", //PENDIENTE HACER OBTENER LA FECHA DEL ULTIMO ANTECEDENTE
      ]);

      !estado_vital ? row.classList.add("fila-roja") : null;

      tbody.append(row);
    }
  );

  document.addEventListener("click", (e) => {
    const fila = e.target.closest("tr[data-id]");
    if (fila) {
      const idPet = fila.getAttribute("data-id");
      location.hash = `#/mascotas/perfil/id=${idPet}`;
    }
  });
};
