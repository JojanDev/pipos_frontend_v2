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
  const contenedorVista = DOMSelector(`[data-modal="edit-client"]`);
  console.log(parametros);
  const { perfil: usuario } = parametros;
  const form = DOMSelector("#form-edit-client");
  const tbody = DOMSelector("#clients .table__body");
  const profileClient = DOMSelector(`[data-modal="profile-client"]`);

  const clientResponse = await get(`usuarios/${usuario.id}`);
  console.log(clientResponse);

  clientResponse.data["select-tipos-documentos"] =
    clientResponse.data.tipo_documento_id;

  await llenarSelectTiposDocumentos();

  mapearDatosEnContenedor(clientResponse.data, form);

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

    cerrarModal("edit-client");
    history.back();
  });

  contenedorVista.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-edit-client");
    if (arrow) {
      cerrarModal("edit-client");

      history.back();
    }
  });
};
