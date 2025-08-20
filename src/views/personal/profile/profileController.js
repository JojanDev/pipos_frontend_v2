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
} from "../../../helpers";
import { cargarTablaEmpleados } from "../personalController";

export const asignarDatosCliente = (data) => {
  const spanNombre = document.querySelector("#profile-nombre");
  const spanRol = document.querySelector("#profile-rol");
  const spanTipoDocumento = document.querySelector("#profile-tipoDocumento");
  const spanNumeroDocumento = document.querySelector(
    "#profile-numeroDocumento"
  );
  const spanDireccion = document.querySelector("#profile-direccion");
  const spanTelefono = document.querySelector("#profile-telefono");
  const spanCorreo = document.querySelector("#profile-correo");
  const spanUsuario = document.querySelector("#profile-usuario");

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
  const btnActivar = document.querySelector("#activar-personal");
  const btnEliminar = document.querySelector("#delete-personal");

  const { id } = parametros;

  const response = await get(`personal/${id}`);

  console.log(response);

  if (!response.success) {
    await error(response.message);
    cerrarModalYVolverAVistaBase();
    return;
  }

  if (response.data.activo) {
    btnActivar.remove();
  } else {
    btnEliminar.remove();
  }

  if (response.data.rol.id == 1) {
    btnEliminar?.remove();
    btnActivar?.remove();
  }
  asignarDatosCliente(response.data);

  const modal = document.querySelector("[data-modal='profile-personal']");

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

    if (e.target.id == "back-profile-personal") {
      esModal
        ? cerrarModal("profile-personal")
        : cerrarModalYVolverAVistaBase();
    }
  });
};
