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

export const asignarDatosCliente = (data) => {
  const spanNombre = DOMSelector("#profile-nombre");
  const spanRol = DOMSelector("#profile-rol");
  const spanTipoDocumento = DOMSelector("#profile-tipoDocumento");
  const spanNumeroDocumento = DOMSelector("#profile-numeroDocumento");
  const spanDireccion = DOMSelector("#profile-direccion");
  const spanTelefono = DOMSelector("#profile-telefono");
  const spanCorreo = DOMSelector("#profile-correo");
  const spanUsuario = DOMSelector("#profile-usuario");

  const {
    correo,
    direccion,
    nombre,
    numeroDocumento,
    telefono,
    tipoDocumento,
  } = data.info;

  spanNombre.textContent = nombre;
  spanTipoDocumento.textContent = tipoDocumento.nombre;
  spanNumeroDocumento.textContent = numeroDocumento;
  spanDireccion.textContent = direccion;
  spanTelefono.textContent = telefono;
  spanCorreo.textContent = correo;
  spanRol.textContent = capitalizarPrimeraLetra(data.rol.nombre);
  if (spanUsuario) spanUsuario.textContent = data.usuario;
};

export const profilePersonalController = async (parametros = null) => {
  const esModal = !location.hash.includes("personal/perfil");
  const btnActivar = DOMSelector("#activar-personal");
  const btnEliminar = DOMSelector("#delete-personal");
  const perfilUsuario = DOMSelector("[data-modal='profile-personal']");

  const { id } = parametros;

  const response = await get(`usuarios/${id}`);

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
  // asignarDatosCliente(response.data);
  mapearDatosEnContenedor(
    { ...response.data, tipo_documento: tipoDocumento.nombre },
    perfilUsuario
  );

  const modal = DOMSelector("[data-modal='profile-personal']");

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-personal") {
      await cargarComponente(routes.personal.editar, { id: id });
    }

    if (e.target.id == "delete-personal") {
      if (response.data.rol.id != 1) {
        const eliminado = await del(`personal/${id}`);
        // console.log(eliminado);
        if (!eliminado.success) {
          await error(eliminado.message);
          return;
        }

        cargarTablaEmpleados();

        await success(eliminado.message);
        esModal
          ? cerrarModal("profile-personal")
          : cerrarModalYVolverAVistaBase();
        return;
      }
    }

    if (e.target.id == "activar-personal") {
      const activado = await put(`personal/activar/${id}`);
      // console.log(eliminado);
      if (!activado.success) {
        await error(activado.message);
        return;
      }

      cargarTablaEmpleados();
      await success(activado.message);
      esModal
        ? cerrarModal("profile-personal")
        : cerrarModalYVolverAVistaBase();
      return;
    }
  });

  configurarBotonCerrar("back-profile-personal", esModal);
};
