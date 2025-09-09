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
import {
  especiesConRazas,
  listarEspecies,
  mostrarMensajePlaceholderRazas,
} from "../../administrationController";

export const profileBreedController = async (parametros = null) => {
  console.log(parametros);

  const { perfil: raza } = parametros;

  const contenedorVista = document.querySelector(
    '[data-modal="breed-profile"]'
  );
  const esModal = !location.hash.includes("administrar_datos/razasPerfil");

  const getRaza = await get(`razas/${raza.id}`);
  console.log(getRaza);

  if (!getRaza.success) {
    await error(getRaza.message);
    cerrarModal("breed-profile");
    history.back();
    return;
  }

  const titulo = document.querySelector("#breed-title");
  const especieNombre = document.querySelector("#breed-specie");

  titulo.textContent = getRaza.data.nombre;
  especieNombre.textContent = `Raza de la especie ${getRaza.data.especie.nombre}`;

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "edit-breed") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "delete-breed") {
      const response = await del(`razas/${raza.id}`);

      if (response.success) {
        successTemporal(response.message);
        const razasTbody = DOMSelector("#breeds .table__body");

        const row = razasTbody.querySelector(`[data-id='${raza.id}']`);
        console.log(especiesConRazas);

        const especie = especiesConRazas.find(
          (e) => e.id === getRaza.data.especie_id
        );
        if (especie) {
          especie.razas = especie.razas.filter((r) => r.id !== getRaza.data.id);
          console.log("Razas actualizadas:", especie.razas);
        }

        if (!especie.razas || especie.razas.length === 0) {
          mostrarMensajePlaceholderRazas(
            "No hay razas registradas para esta especie"
          );
        }

        // if (!especie) return;

        row.remove();
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
