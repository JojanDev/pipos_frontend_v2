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
  console.log(parametros);

  const { perfil: especie } = parametros;
  // const { id } = parametros;

  const modal = document.querySelector('[data-modal="specie-profile"]');
  const esModal = !location.hash.includes("administrar_datos/especiesPerfil");

  const response = await get(`especies/${especie.id}`);

  if (!response.success) {
    await error(response.message);
    esModal ? cerrarModal("specie-profile") : cerrarModalYVolverAVistaBase();
    return;
  }

  const titulo = document.querySelector("#specie-title");


  titulo.textContent = response.data.nombre;

  // const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  // console.log(acciones);


  // for (const accion of acciones) {
  //   console.log(accion.dataset.permiso.split(","));
  //   console.log(hasPermission(accion.dataset.permiso.split(",")));
  //   if (!hasPermission(accion.dataset.permiso.split(","))) {
  //     accion.remove();
  //   }
  // }


  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-specie") {
      // await cargarComponente(routes.administrar_datos.especiesEditar, {
      //   id: especie.id,
      //   nombre: response.data.nombre,
      // });
      location.hash = (location.hash + (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`));

    }

    if (e.target.id == "delete-specie") {
      const response = await del(`especies/${especie.id}`);

      if (response.success) {
        await success(response.message);
        listarEspecies();
        cerrarModal("specie-profile")
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
