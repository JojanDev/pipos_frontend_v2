import {
  error,
  loginSuccess,
  success,
  get,
  post,
  cargarTiposDocumento,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelect,
  crearFila,
  cerrarModalYVolverAVistaBase,
  cerrarModal,
} from "../../../helpers";

export const createClienteExistController = async () => {
  const form = document.querySelector("#form-register-clienteExist");
  // const selectTipoDocumento = document.querySelector("#tipos-documento");
  // await cargarTiposDocumento(selectTipoDocumento);
  const esModal = !location.hash.includes("clientes/crearExistente");

  llenarSelect({
    endpoint: "personal/noClientes",
    selector: "#select-info",
    optionMapper: (info) => ({
      id: info.id,
      text: `${info.numero_documento} - ${info.nombre}`,
    }),
  });

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await post("clientes/infoExistente", datos);

    //Se valida el inicio exitoso
    if (!response.success) {
      //Se muestra un mensaje
      await error(response.message);
      return;
    }

    const tbody = document.querySelector("#clients .table__body");
    if (tbody) {
      const info = response.data.info;

      const row = crearFila([
        response.data.id,
        info.nombre,
        info.telefono,
        info.numeroDocumento,
        info.direccion,
      ]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    await success(response.message);

    esModal
      ? cerrarModal("create-clienteExist")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-create-clienteExist");

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("create-clienteExist")
      : cerrarModalYVolverAVistaBase();
  });
};
