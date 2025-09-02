import {
  error,
  successTemporal,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  get,
  put,
  mapearDatosEnContenedor,
  llenarSelectTiposDocumentos,
  DOMSelector,
  crearFila,
  capitalizarPrimeraLetra,
} from "../../../helpers";
import { cargarTablaEmpleados } from "../personalController";

export const editPersonalController = async (parametros = null) => {
  const { id } = parametros;

  const form = DOMSelector("#form-edit-personal");
  const selectTipoDocumento = DOMSelector("#tipos-documento");
  const tbody = DOMSelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/crear");
  const perfilUsuario = DOMSelector("[data-modal='profile-personal']");


  configurarEventosValidaciones(form);

  await llenarSelectTiposDocumentos();

  // Obtenemos el formulario
  const formulario = DOMSelector("#form-edit-personal");

  // Obtenemos todos los inputs dentro del formulario que tengan atributo name
  const inputsConNombre = formulario.querySelectorAll("[name]");

  // Creamos un objeto donde guardamos las referencias a los inputs usando su atributo name como clave
  const campos = {};
  inputsConNombre.forEach((input) => {
    const nombreCampo = input.name;
    campos[nombreCampo] = input;
  });

  const response = await get(`usuarios/${id}`);

  mapearDatosEnContenedor(
    { ...response.data, "select-tipos-documentos": response.data.tipo_documento_id },
    form
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const responsePut = await put(`usuarios/${response.data.id}`, datos);

    console.log(responsePut);


    if (!responsePut.success)
      return await error(responsePut.message);


    successTemporal(responsePut.message);

    // const responseP = await get(`personal/${id}`);

    // asignarDatosCliente(responseP.data);

    const { data: tipoDocumento } = await get(`tipos-documentos/${responsePut.data.tipo_documento_id}`);

    mapearDatosEnContenedor(
      { ...responsePut.data, tipo_documento: tipoDocumento.nombre },
      perfilUsuario
    );

    const tBodyUsuarios = DOMSelector(`#personal .table__body`);
    const oldRow = tBodyUsuarios.querySelector(`[data-id='${responsePut.data.id}']`)

    const rolesUsuario = await get(`roles-usuarios/usuario/${responsePut.data.id}`);
    // console.log(rolesUsuario);
    let nombreRoles;
    if (!rolesUsuario.success) {
      nombreRoles = ["No aplica"];
    } else {
      nombreRoles = await Promise.all(
        rolesUsuario.data.map(async (roleUsuario) => {
          const { data: rol } = await get(`roles/${roleUsuario.rol_id}`);
          return capitalizarPrimeraLetra(rol.nombre);
        })
      );
    }

    const updatesRow = crearFila([responsePut.data.id, nombreRoles, responsePut.data.nombre, responsePut.data.telefono, responsePut.data.numero_documento, responsePut.data.direccion]);

    tBodyUsuarios.replaceChild(updatesRow, oldRow);

    esModal ? cerrarModal("edit-personal") : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-personal");
    if (arrow) {
      esModal ? cerrarModal("edit-personal") : cerrarModalYVolverAVistaBase();
    }
  });
};
