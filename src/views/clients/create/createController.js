import {
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  crearFila,
  datos,
  DOMSelector,
  error,
  llenarSelect,
  llenarSelectTiposDocumentos,
  post,
  successTemporal,
  validarCampos,
} from "../../../helpers";

export const createClientController = async () => {
  const form = document.querySelector("#form-register-client");
  const tbody = document.querySelector("#clients .table__body");
  const contenedorVista = DOMSelector(`[data-modal="create-client"]`);

  //Inicializacion
  await llenarSelectTiposDocumentos();

  configurarEventosValidaciones(form);

  //Evento
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const createUserResponse = await post("usuarios", datos);

    console.log(createUserResponse);

    if (!createUserResponse.success)
      return await error(createUserResponse.message);

    const clientRoleResponse = await post("roles-usuarios", {
      usuario_id: createUserResponse.data.id,
      rol_id: 3, //Rol cliente
    });

    successTemporal(createUserResponse.message);

    if (tbody) {
      const { id, nombre, telefono, numero_documento, direccion } =
        createUserResponse.data;

      const row = crearFila([
        id,
        nombre,
        telefono,
        numero_documento,
        direccion,
      ]);

      tbody.insertAdjacentElement("afterbegin", row);
    }

    cerrarModal("create-client");
    history.back();
  });

  //Evento de cierre del modal
  contenedorVista.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("#back-register-client")) {
      cerrarModal("create-client");
      history.back();
    }
  });
};
