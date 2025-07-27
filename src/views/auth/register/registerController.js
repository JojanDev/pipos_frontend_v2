import { error, loginSuccess, success } from "../../../helpers/alertas";
import { get, post } from "../../../helpers/api";
import { cargarTiposDocumento } from "../../../helpers/cargarTiposDocumento";
import {
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../helpers/validaciones";

export const registerController = async () => {
  const form = document.querySelector("#form-register");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const response = await post("personal", datos);

    console.log(response);

    //Se valida el inicio exitoso
    if (response.success) {
      //Se muestra un mensaje
      await success(response.message);
      window.location.hash = "#/login";
    } else {
      //Se muestra un mensaje
      await error(response.message);
    }
  });
};
