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
} from "../../../helpers";

export const asignarDatosCliente = (data) => {
  const spanNombre = document.querySelector("#profile-nombre");
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
  if (spanUsuario) spanUsuario.textContent = data.usuario;
};

export const profilePersonalController = async (parametros = null) => {
  const tbody = document.querySelector("#pets-client .table__body");
  const btnAtras = document.querySelector("#back-profile-personal");
  const btnRegisterPets = document.querySelector("#register-pets-client");
  const esModal = !location.hash.includes("personal/perfil");

  console.log(btnAtras);

  const { id } = parametros;

  const response = await get(`personal/${id}`);
  console.log(response);

  if (!response.success) {
    await error(response.message);
    cerrarModalYVolverAVistaBase();
    return;
  }

  asignarDatosCliente(response.data);

  const modal = document.querySelector("[data-modal='profile-personal']");

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-personal") {
      console.log("id EDITAR PERSONAL", id);
      await cargarComponente(routes.personal.editar, { id: id });
    }

    if (e.target.id == "delete-personal") {
      const eliminado = await del(`personal/${id}`);
      console.log(eliminado);
    }

    if (e.target.id == "back-profile-personal") {
      esModal
        ? cerrarModal("profile-personal")
        : cerrarModalYVolverAVistaBase();
    }
  });
};
