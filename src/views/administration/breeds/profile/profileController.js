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

export const profileBreedController = async (parametros = null) => {
  const { id } = parametros;

  const modal = document.querySelector('[data-modal="breed-profile"]');
  const esModal = !location.hash.includes("administrar_datos/razasPerfil");

  const response = await get(`razas/${id}`);

  if (!response.success) {
    await error(response.message);
    esModal ? cerrarModal("breed-profile") : cerrarModalYVolverAVistaBase();
    return;
  }

  const titulo = document.querySelector("#breed-title");
  const especieNombre = document.querySelector("#breed-specie");

  titulo.textContent = response.data.nombre;
  especieNombre.textContent = `Raza de la especie ${response.data.especie.nombre}`;

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-breed") {
      await cargarComponente(routes.administrar_datos.razasEditar, {
        id: id,
        nombre: response.data.nombre,
        id_especie: response.data.especie.id,
      });
    }

    if (e.target.id == "delete-breed") {
      const response = await del(`razas/${id}`);

      if (response.success) {
        await success(response.message);
        listarEspecies();
        esModal ? cerrarModal("breed-profile") : cerrarModalYVolverAVistaBase();
      } else {
        await error(response.message);
        return;
      }
    }

    if (e.target.id == "back-breed-profile") {
      esModal ? cerrarModal("breed-profile") : cerrarModalYVolverAVistaBase();
    }
  });
};
