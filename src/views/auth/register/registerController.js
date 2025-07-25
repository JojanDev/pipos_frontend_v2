import { error } from "../../../helpers/alertas";
import { get } from "../../../helpers/api";
import {
  configurarEventosValidaciones,
  validarCampos,
} from "../../../helpers/validaciones";

const cargarTiposDcoumento = async (select) => {
  const datos = await get("tipos-documentos");

  console.log(datos);

  if (!datos.success) {
    await error(datos.message);
  }

  datos.data.forEach((tipo) => {
    const option = document.createElement("option");
    option.value = tipo.id;
    option.textContent = tipo.nombre;
    select.appendChild(option);
  });
};

export const registerController = async () => {
  const form = document.querySelector("#form-register");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  await cargarTiposDcoumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
  });
};
