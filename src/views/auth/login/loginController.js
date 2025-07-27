import { error, loginSuccess } from "../../../helpers/alertas";
import { post } from "../../../helpers/api";
import {
  configurarEventosValidaciones,
  datos,
  validarAlfanumericos,
  validarCampos,
} from "../../../helpers/validaciones";

//Funcion para validar los datos de inicio de sesion
const validarSesion = async ({ usuario, contrasena }) => {
  //Se realiza la peticion
  const response = await post("personal/login", {
    usuario,
    contrasena,
  });

  //Se valida el inicio exitoso
  if (response.code == 200) {
    //Se muestra un mensaje
    await loginSuccess(response.message);
    return true;
  }

  //Se valida si ocurrio un error
  if (response.code > 200) {
    //Se muestra un mensaje
    await error(response.message);
    return false;
  }
};

export const loginController = async () => {
  const form = document.querySelector("#form");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    if (await validarSesion(datos)) {
      localStorage.setItem("isAuthenticated", "true");
      window.location.hash = "#/inicio";
    }
  });
};
