import { routes } from "../../../router/routes";
import {
  error,
  get,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  del,
  success,
  put,
  DOMSelector,
  mapearDatosEnContenedor,
  configurarBotonCerrar,
} from "../../../helpers";
import { cargarTablaEmpleados } from "../personalController";

export const profilePersonalController = async (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="profile-personal"]`);
  const { perfil: usuario } = parametros;
  // const { id } = parametros;

  const esModal = !location.hash.includes("personal/perfil");
  const btnActivar = DOMSelector("#activar-personal");
  const btnEliminar = DOMSelector("#delete-personal");
  const perfilUsuario = DOMSelector("[data-modal='profile-personal']");

  const response = await get(`usuarios/${usuario.id}`);

  console.log(response);

  if (!response.success) {
    await error(response.message);
    cerrarModalYVolverAVistaBase();
    return;
  }

  // if (response.data.activo) {
  //   btnActivar.remove();
  // } else {
  //   btnEliminar.remove();
  // }

  // if (response.data.rol.id == 1) {
  //   btnEliminar?.remove();
  //   btnActivar?.remove();
  // }
  const { data: tipoDocumento } = await get(
    `tipos-documentos/${response.data.tipo_documento_id}`
  );
  // const contenedorVista = DOMSelector(`[data-modal="profile-personal"]`);
  const rolesUsuario = await get(`roles-usuarios/usuario/${response.data.id}`);
  const contenedorRoles = contenedorVista.querySelector(".contenedor-roles");

  console.log(rolesUsuario);

  if (rolesUsuario.success) {
    rolesUsuario.data.forEach(async (rolUsuario) => {
      const pRol = document.createElement("p");
      pRol.classList.add("roles");
      const { data: rol } = await get(`roles/${rolUsuario.rol_id}`);
      console.log(rol);

      pRol.textContent = capitalizarPrimeraLetra(rol.nombre);
      contenedorRoles.append(pRol);
    });
  }

  const credencial = await get(`credenciales/usuario/${response.data.id}`);
  const contenedorCredenciales = DOMSelector(`#credenciales`);

  if (credencial.success) {
    DOMSelector("#usuario").textContent = credencial.data.usuario;
  } else {
    contenedorCredenciales.remove();
  }

  mapearDatosEnContenedor(
    { ...response.data, tipo_documento: tipoDocumento.nombre },
    perfilUsuario
  );

  const modal = DOMSelector("[data-modal='profile-personal']");

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-personal") {
      // await cargarComponente(routes.personal.editar, { id: usuario.id });
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "delete-personal") {
      if (response.data.rol.id != 1) {
        const eliminado = await del(`usuarios/${usuario.id}`);
        // console.log(eliminado);
        if (!eliminado.success) {
          await error(eliminado.message);
          return;
        }

        cargarTablaEmpleados();

        await success(eliminado.message);
        cerrarModal("profile-personal");
        history.back();
        return;
      }
    }

    if (e.target.id == "activar-personal") {
      const activado = await put(`personal/activar/${usuario.id}`);
      // console.log(eliminado);
      if (!activado.success) {
        await error(activado.message);
        return;
      }

      cargarTablaEmpleados();
      await success(activado.message);
      cerrarModal("profile-personal");
      history.back();
      return;
    }
  });

  // configurarBotonCerrar("back-profile-personal", esModal);
  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "back-profile-personal") {
      cerrarModal("profile-personal");
      history.back();
    }
  });
};
