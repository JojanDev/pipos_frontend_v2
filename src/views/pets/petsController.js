import {
  get,
  crearFila,
  convertirFechaLocalDate,
  error,
  DOMSelector,
  DOMSelectorAll,
} from "../../helpers";
import hasPermission from "../../helpers/hasPermission";
import { formatoCorto } from "../ventas/profile/profileController";

export const petsController = async () => {
  const contenedorVista = DOMSelector("#mascotas");
  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }
  const tbody = DOMSelector("#pets .table__body");
  const tablePets = DOMSelector("#pets");

  const petsResponse = await get("mascotas");
  console.log(petsResponse);

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
      ultimo_antecedente,
      estado_vital,
    }) => {
      const row = crearFila([
        id,
        nombre,
        especie,
        raza,
        cliente,
        telefono,
        ultimo_antecedente ? formatoCorto(ultimo_antecedente) : "Sin registros", //PENDIENTE HACER OBTENER LA FECHA DEL ULTIMO ANTECEDENTE
      ]);
      !estado_vital ? row.classList.add("fila-roja") : null;

      tbody.append(row);
    }
  );

  tablePets.addEventListener("click", (e) => {
    const fila = e.target.closest("tr[data-id]");
    if (fila) {
      const idPet = fila.getAttribute("data-id");
      // location.hash = `#/mascotas/id=${idPet}/perfil`;
      if (!hasPermission(["mascota.read"])) {
        return;
      }
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `perfil/id=${idPet}`
          : `/perfil/id=${idPet}`);
    }
  });
};
