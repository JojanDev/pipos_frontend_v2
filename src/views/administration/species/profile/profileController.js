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
} from "../../../../helpers";
import { listarEspecies } from "../../administrationController";

export const profileSpecieController = async (parametros = null) => {
  const { id } = parametros;

  const modal = document.querySelector('[data-modal="specie-profile"]');
  const esModal = !location.hash.includes("administrar_datos/especiesPerfil");

  const response = await get(`especies/${id}`);

  if (!response.success) {
    await error(response.message);
    esModal ? cerrarModal("specie-profile") : cerrarModalYVolverAVistaBase();
    return;
  }

  const titulo = document.querySelector("#specie-title");

  titulo.textContent = response.data.nombre;

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-specie") {
      await cargarComponente(routes.administrar_datos.especiesEditar, {
        id: id,
        nombre: response.data.nombre,
      });
    }

    if (e.target.id == "delete-specie") {
      const response = await del(`especies/${id}`);

      if (response.success) {
        await success(response.message);
        listarEspecies();
        esModal
          ? cerrarModal("specie-profile")
          : cerrarModalYVolverAVistaBase();
      } else {
        await error(response.message);
        return;
      }
    }

    if (e.target.id == "back-specie-profile") {
      esModal ? cerrarModal("specie-profile") : cerrarModalYVolverAVistaBase();
    }
  });
};
