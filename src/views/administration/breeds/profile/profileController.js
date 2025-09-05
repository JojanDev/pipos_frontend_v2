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
  console.log(parametros);

  const { id } = parametros;
  const { perfil: raza } = parametros;

  const contenedorVista = document.querySelector(
    '[data-modal="breed-profile"]'
  );
  const esModal = !location.hash.includes("administrar_datos/razasPerfil");

  const response = await get(`razas/${raza.id}`);

  if (!response.success) {
    await error(response.message);
    cerrarModal("breed-profile");
    history.back();
    return;
  }

  const titulo = document.querySelector("#breed-title");
  const especieNombre = document.querySelector("#breed-specie");

  titulo.textContent = response.data.nombre;
  especieNombre.textContent = `Raza de la especie ${response.data.especie.nombre}`;

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "edit-breed") {
      // await cargarComponente(routes.administrar_datos.razasEditar, {
      //   id: raza.id,
      //   nombre: response.data.nombre,
      //   especie_id: response.data.especie_id,
      // });
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "delete-breed") {
      const response = await del(`razas/${raza.id}`);

      if (response.success) {
        await success(response.message);
        listarEspecies();
        cerrarModal("breed-profile");
        history.back();
      } else {
        await error(response.message);
        return;
      }
    }

    if (e.target.id == "back-breed-profile") {
      cerrarModal("breed-profile");
      history.back();
    }
  });
};
