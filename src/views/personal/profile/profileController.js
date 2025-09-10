import { routes } from "../../../router/routes";
import {
  error,
  get,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  del,
  success,
  put,
  DOMSelector,
  mapearDatosEnContenedor,
  patch,
  successTemporal,
} from "../../../helpers";

import hasPermission from "../../../helpers/hasPermission";

export const profilePersonalController = async (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="profile-personal"]`);
  const { perfil: usuario } = parametros;
  // const { id } = parametros;

  const esModal = !location.hash.includes("personal/perfil");
  const btnActivar = DOMSelector("#activar-personal");
  const btnEdit = DOMSelector("#edit-personal");
  const btnEliminar = DOMSelector("#delete-personal");
  const perfilUsuario = DOMSelector("[data-modal='profile-personal']");

  const response = await get(`usuarios/${usuario.id}`);

  console.log(response);

  if (!response.success) {
    await error(response.message);
    history.back();

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
    await Promise.all(
      rolesUsuario.data.map(async (rolUsuario) => {
        if (rolUsuario.rol_id == 1) {
          btnEliminar?.remove();
          btnActivar?.remove();
          btnEdit?.remove();
        }
        const pRol = document.createElement("p");
        pRol.classList.add("roles");
        const { data: rol } = await get(`roles/${rolUsuario.rol_id}`);
        console.log(rol);

        pRol.textContent = capitalizarPrimeraLetra(rol.nombre);
        contenedorRoles.append(pRol);
      })
    );
  }

  const credencial = await get(`credenciales/usuario/${response.data.id}`);
  const contenedorCredenciales = DOMSelector(`#credenciales`);

  if (credencial.success) {
    DOMSelector("#usuario").textContent = credencial.data.usuario;

    if (credencial.data.activo) {
      btnActivar?.remove();
    } else {
      btnEliminar.remove();
    }
  } else {
    contenedorCredenciales.remove();
    btnActivar?.remove();
    btnEliminar.remove();
  }

  mapearDatosEnContenedor(
    { ...response.data, tipo_documento: tipoDocumento.nombre },
    perfilUsuario
  );

  const modal = DOMSelector("[data-modal='profile-personal']");

  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-personal") {
      // await cargarComponente(routes.personal.editar, { id: usuario.id });
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "delete-personal") {
      const eliminado = await patch(`credenciales/${credencial.data.id}`, {
        activo: false,
      });
      // console.log(eliminado);
      if (!eliminado.success) {
        await error(eliminado.message);
        return;
      }

      const row = DOMSelector(`#personal [data-id='${usuario.id}']`);
      row.classList.add("fila-alerta");
      // cargarTablaEmpleados();

      successTemporal("Usuario desactivado");
      cerrarModal("profile-personal");
      history.back();
      return;
    }

    if (e.target.id == "activar-personal") {
      const activado = await patch(`credenciales/${credencial.data.id}`, {
        activo: true,
      });
      // console.log(eliminado);
      if (!activado.success) {
        await error(activado.message);
        return;
      }

      const row = DOMSelector(`#personal [data-id='${usuario.id}']`);
      row.classList.remove("fila-alerta");

      // cargarTablaEmpleados();
      successTemporal("Usuario activado");
      cerrarModal("profile-personal");
      history.back();
      return;
    }
  });

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "back-profile-personal") {
      cerrarModal("profile-personal");
      history.back();
    }
  });
};
