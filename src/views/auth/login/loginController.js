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

  //Se obtiene la respuesta
  const data = await response.json();

  //Se valida el inicio exitoso
  if (data.code == 200) {
    //Se muestra un mensaje
    await loginSuccess(data.message);
    return true;
  }

  //Se valida si ocurrio un error
  if (data.code > 200) {
    //Se muestra un mensaje
    await error(data.message);
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
