import { routes } from "../../../router/routes";
import {
  error,
  get,
  cerrarModal,
  del,
  successTemporal,
  mapearDatosEnContenedor,
  DOMSelector,
} from "../../../helpers";
import hasPermission from "../../../helpers/hasPermission";

export const profileMedicamentInfoController = async (parametros = null) => {
  console.log(parametros);

  // const { id } = parametros;
  const { perfil: infoMedicamento } = parametros;

  const contenedorVista = DOMSelector(`[data-modal="profile-medicament-info"]`);

  const tbody = DOMSelector("#pets-client .table__body");
  const btnAtras = DOMSelector("#back-profile-medicament-info");
  const esModal = !location.hash.includes("medicamentos_info/perfil");

  const response = await get(`info-medicamentos/${infoMedicamento.id}`);

  console.log(response);

  if (!response.success) {
    await error(response.message);
    cerrarModal("profile-medicament-info");
    history.back();

    return;
  }

  mapearDatosEnContenedor(response.data, contenedorVista);

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
    if (e.target.id == "back-profile-medicament-info") {
      cerrarModal("profile-medicament-info");
      history.back();
    }

    if (e.target.id == "edit-medicament-info") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "delete-medicament-info") {
      const eliminado = await del(`info-medicamentos/${infoMedicamento.id}`);
      console.log(eliminado);

      if (!eliminado.success) return await error(eliminado.message);

      const contenedor = DOMSelector("#medicaments-info");
      const row = contenedor.querySelector(`[data-id='${infoMedicamento.id}']`);
      row.remove();

      successTemporal(eliminado.message);

      cerrarModal("profile-medicament-info");
      history.back();
    }
  });
};
