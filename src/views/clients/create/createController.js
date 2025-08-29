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
} from "../../../helpers";

export const createClientController = async () => {
  const form = document.querySelector("#form-register-client");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/crear");

  await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await post("usuarios", datos);

    console.log(response);


    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);

    if (tbody) {
      const {
        id,
        info: { nombre, telefono, numeroDocumento, direccion },
      } = response.data;

      const row = crearFila([id, nombre, telefono, numeroDocumento, direccion]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-client");
    if (arrow) {
      esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
    }
  });
};
