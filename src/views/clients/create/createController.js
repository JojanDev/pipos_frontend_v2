import {
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  crearFila,
  datos,
  error,
  llenarSelect,
  post,
  successTemporal,
  validarCampos,
} from "../../../helpers";

export const createClientController = async () => {
  const form = document.querySelector("#form-register-client");
  const tbody = document.querySelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/crear");

  //Inicializacion
  llenarSelect({
    endpoint: "tipos-documentos",
    selector: "#tipos-documento",
    optionMapper: ({ id, nombre }) => ({ id, text: nombre }),
  });

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
      rol_id: 5, //Rol cliente
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

    esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  });

  //Evento de cierre del modal
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("#back-register-client")) {
      // esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
      cerrarModal("create-client");
      location.hash = "#/clientes";
    }
  });
};
