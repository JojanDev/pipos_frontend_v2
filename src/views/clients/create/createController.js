import { error, successTemporal } from "../../../helpers/alertas";
import { post } from "../../../helpers/api";
import { cargarTiposDocumento } from "../../../helpers/cargarTiposDocumento";
import { crearFila } from "../../../helpers/crearFila";
import {
  cerrarModal,
  cerrarModalYVolverAVistaBase,
} from "../../../helpers/modal";
import {
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../helpers/validaciones";

export const createClientController = async () => {
  const form = document.querySelector("#form-register-client");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#clientes .table__body");
  const esModal = !location.hash.includes("clientes/crear");

  await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const response = await post("clientes", datos);

    console.log(response);

    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);
    console.log(response);

    if (tbody) {
      const { id, nombre, telefono, numeroDocumento, direccion, correo } =
        response.data;

      const row = crearFila([
        id,
        nombre,
        telefono,
        numeroDocumento,
        direccion,
        correo,
      ]);
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
