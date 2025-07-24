import { error } from "../../../helpers/alertas";
import { get } from "../../../helpers/api";
import { validarCampos } from "../../../helpers/validaciones";

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
  console.log("hola");

  const form = document.querySelector("#form-register");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  console.log(selectTipoDocumento.selectedIndex);

  await cargarTiposDcoumento(selectTipoDocumento);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
  });
};
