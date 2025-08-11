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
} from "../../../helpers";

export const createPersonalController = async () => {
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
      window.location.hash = "#/personal";
    } else {
      //Se muestra un mensaje
      await error(response.message);
    }
  });
};
