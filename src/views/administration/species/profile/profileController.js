import { routes } from "../../../../router/routes";
import {
  error,
  convertirADiaMesAño,
  get,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  del,
  success,
  DOMSelector,
  successTemporal,
} from "../../../../helpers";
import { listarEspecies } from "../../administrationController";
import hasPermission from "../../../../helpers/hasPermission";

export const profileSpecieController = async (parametros = null) => {
  console.log(parametros);

  const { perfil: especie } = parametros;
  // const { id } = parametros;

  const contenedorVista = DOMSelector('[data-modal="specie-profile"]');

  const response = await get(`especies/${especie.id}`);

  if (!response.success) {
    await error(response.message);
    cerrarModal("specie-profile");
    history.back();
    return;
  }

  const titulo = DOMSelector("#specie-title");

  titulo.textContent = response.data.nombre;

  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "edit-specie") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "delete-specie") {
      const response = await del(`especies/${especie.id}`);

      if (response.success) {
        successTemporal(response.message);
        const fila = DOMSelector(`#species [data-id="${especie.id}"]`);
        fila.remove();
        cerrarModal("specie-profile");
        history.back();
      } else {
        await error(response.message);
        return;
      }
    }

    if (e.target.id == "back-specie-profile") {
      cerrarModal("specie-profile");
      history.back();
    }
  });
};
