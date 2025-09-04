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
  mapearDatosEnContenedor,
  llenarSelectTiposDocumentos,
  DOMSelector,
  crearFila,
} from "../../../helpers";
// import { asignarDatosCliente } from "../../personal/profile/profileController";
import { cargarTabla } from "../clientsController";

const asignarDatosCliente = (data) => {
  const spanNombre = DOMSelector("#profile-nombre");
  const spanTipoDocumento = DOMSelector("#profile-tipoDocumento");
  const spanNumeroDocumento = DOMSelector("#profile-numeroDocumento");
  const spanDireccion = DOMSelector("#profile-direccion");
  const spanTelefono = DOMSelector("#profile-telefono");
  const spanCorreo = DOMSelector("#profile-correo");

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
  console.log(parametros);
  const { perfil: usuario } = parametros;
  // const { id } = parametros;
  const form = DOMSelector("#form-edit-client");
  const selectTipoDocumento = DOMSelector("#tipos-documento");
  const tbody = DOMSelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/editar");
  const profileClient = DOMSelector(`[data-modal="profile-client"]`);

  // Obtenemos el formulario
  // Obtenemos todos los inputs dentro del formulario que tengan atributo name
  // const inputsConNombre = form.querySelectorAll("[name]");

  // Creamos un objeto donde guardamos las referencias a los inputs usando su atributo name como clave
  // const campos = {};
  // inputsConNombre.forEach((input) => {
  //   const nombreCampo = input.name;
  //   campos[nombreCampo] = input;
  // });

  const clientResponse = await get(`usuarios/${usuario.id}`);
  console.log(clientResponse);

  clientResponse.data["select-tipos-documentos"] =
    clientResponse.data.tipo_documento_id;

  // Aquí puedes definir los datos que quieres precargar en los inputs
  // const datosCliente = {
  //   nombre: cliente.data.info.nombre,
  //   id_tipo_documento: cliente.data.info.tipoDocumento.id, // Asegúrate de que el value del option coincida
  //   numero_documento: cliente.data.info.numeroDocumento,
  //   telefono: cliente.data.info.telefono,
  //   correo: cliente.data.info.correo,
  //   direccion: cliente.data.info.direccion,
  // };

  // // Asignamos los valores del objeto a los inputs
  // for (const campo in datosCliente) {
  //   if (campos[campo]) {
  //     campos[campo].value = datosCliente[campo];
  //   }
  // }

  await llenarSelectTiposDocumentos();

  mapearDatosEnContenedor(clientResponse.data, form);

  ///////////////////////////////////////////////////////////

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const putClientResponse = await put(`usuarios/${usuario.id}`, datos);
    console.log(putClientResponse);

    if (!putClientResponse.success)
      return await error(putClientResponse.message);

    const typeDocumentResponse = await get(
      "tipos-documentos/" + putClientResponse.data.tipo_documento_id
    );
    putClientResponse.data["tipo_documento"] = typeDocumentResponse.data.nombre;
    putClientResponse.data["cliente"] = putClientResponse.data.nombre;

    mapearDatosEnContenedor(putClientResponse.data, profileClient);

    const oldRow = tbody.querySelector(`tr[data-id='${usuario.id}']`);

    const updatedRow = crearFila([
      putClientResponse.data.id,
      putClientResponse.data.cliente,
      putClientResponse.data.telefono,
      putClientResponse.data.numero_documento,
      putClientResponse.data.direccion,
    ]);

    tbody.replaceChild(updatedRow, oldRow);

    successTemporal(putClientResponse.message);

    esModal ? cerrarModal("edit-client") : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-edit-client");
    if (arrow) {
      // esModal ? cerrarModal("edit-client") : cerrarModalYVolverAVistaBase();
      console.log("si");
      cerrarModal("edit-client");
      location.hash = `#/clientes/perfil/id=${usuario.id}`;
    }
  });
};
