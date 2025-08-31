import {
  error,
  successTemporal,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  put,
  get,
} from "../../../helpers";
// import { asignarDatosCliente } from "../../personal/profile/profileController";
import { cargarTabla } from "../clientsController";

const asignarDatosCliente = (data) => {
  const spanNombre = document.querySelector("#profile-nombre");
  const spanTipoDocumento = document.querySelector("#profile-tipoDocumento");
  const spanNumeroDocumento = document.querySelector(
    "#profile-numeroDocumento"
  );
  const spanDireccion = document.querySelector("#profile-direccion");
  const spanTelefono = document.querySelector("#profile-telefono");
  const spanCorreo = document.querySelector("#profile-correo");

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
};

export const editClientController = async (parametros = null) => {
  const { id } = parametros;
  const form = document.querySelector("#form-edit-client");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/editar");

  // Obtenemos el formulario
  // Obtenemos todos los inputs dentro del formulario que tengan atributo name
  const inputsConNombre = form.querySelectorAll("[name]");

  // Creamos un objeto donde guardamos las referencias a los inputs usando su atributo name como clave
  const campos = {};
  inputsConNombre.forEach((input) => {
    const nombreCampo = input.name;
    campos[nombreCampo] = input;
  });

  const cliente = await get(`clientes/${id}`);

  // Aquí puedes definir los datos que quieres precargar en los inputs
  const datosCliente = {
    nombre: cliente.data.info.nombre,
    id_tipo_documento: cliente.data.info.tipoDocumento.id, // Asegúrate de que el value del option coincida
    numero_documento: cliente.data.info.numeroDocumento,
    telefono: cliente.data.info.telefono,
    correo: cliente.data.info.correo,
    direccion: cliente.data.info.direccion,
  };

  // Asignamos los valores del objeto a los inputs
  for (const campo in datosCliente) {
    if (campos[campo]) {
      campos[campo].value = datosCliente[campo];
    }
  }

  ///////////////////////////////////////////////////////////

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await put(`clientes/${cliente.data.info.id}`, datos);

    if (!response.success) {
      await error(response.message);
      return;
    }

    const clienteActualizado = await get(`clientes/${id}`);

    asignarDatosCliente(clienteActualizado.data);
    cargarTabla();

    await successTemporal(response.message);
    //

    // if (tbody) {
    //   const {
    //     id,
    //     info: { nombre, telefono, numeroDocumento, direccion },
    //   } = response.data;

    //   const row = crearFila([id, nombre, telefono, numeroDocumento, direccion]);
    //   tbody.insertAdjacentElement("afterbegin", row);
    // }

    esModal ? cerrarModal("edit-client") : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-edit-client");
    if (arrow) {
      esModal ? cerrarModal("edit-client") : cerrarModalYVolverAVistaBase();
    }
  });
};
