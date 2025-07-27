import { error, successTemporal } from "../../../helpers/alertas";
import { post } from "../../../helpers/api";
import { cargarTiposDocumento } from "../../../helpers/cargarTiposDocumento";
import { crearFila } from "../../../helpers/crearFila";
import { cerrarModalYVolverAVistaBase } from "../../../helpers/modal";
import {
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../helpers/validaciones";

export const createController = async () => {
  const form = document.querySelector("#form-register-client");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#clientes .table__body");

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

    const {
      data: {
        id,
        info: { nombre, telefono, numeroDocumento, direccion, correo },
      },
    } = response;

    const row = crearFila([
      id,
      nombre,
      telefono,
      numeroDocumento,
      direccion,
      correo,
    ]);

    if (tbody) {
      tbody.insertAdjacentElement("afterbegin", row);
    }

    await successTemporal(response.message);
    cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-client");
    if (arrow) {
      cerrarModalYVolverAVistaBase();
    }
  });
};
