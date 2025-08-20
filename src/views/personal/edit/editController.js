import {
  error,
  successTemporal,
  post,
  cargarTiposDocumento,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  get,
  put,
} from "../../../helpers";
import { cargarTablaEmpleados } from "../personalController";
import { asignarDatosCliente } from "../profile/profileController";

export const editPersonalController = async (parametros = null) => {
  const { id } = parametros;

  ///////////////////////////////////////////////////////////
  const form = document.querySelector("#form-edit-personal");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/crear");

  await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  // Obtenemos el formulario
  const formulario = document.querySelector("#form-edit-personal");

  // Obtenemos todos los inputs dentro del formulario que tengan atributo name
  const inputsConNombre = formulario.querySelectorAll("[name]");

  // Creamos un objeto donde guardamos las referencias a los inputs usando su atributo name como clave
  const campos = {};
  inputsConNombre.forEach((input) => {
    const nombreCampo = input.name;
    campos[nombreCampo] = input;
  });

  const response = await get(`personal/${id}`);

  // Aquí puedes definir los datos que quieres precargar en los inputs
  const datosCliente = {
    nombre: response.data.info.nombre,
    id_tipo_documento: response.data.info.tipoDocumento.id, // Asegúrate de que el value del option coincida
    numero_documento: response.data.info.numeroDocumento,
    telefono: response.data.info.telefono,
    correo: response.data.info.correo,
    direccion: response.data.info.direccion,
  };

  // Asignamos los valores del objeto a los inputs
  for (const campo in datosCliente) {
    if (campos[campo]) {
      campos[campo].value = datosCliente[campo];
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const responsePut = await put(`personal/${response.data.info.id}`, datos);

    if (!responsePut.success) {
      await error(responsePut.message);
      return;
    }

    await successTemporal(responsePut.message);

    const responseP = await get(`personal/${id}`);

    asignarDatosCliente(responseP.data);
    cargarTablaEmpleados();

    esModal ? cerrarModal("edit-personal") : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-personal");
    if (arrow) {
      esModal ? cerrarModal("edit-personal") : cerrarModalYVolverAVistaBase();
    }
  });
};
