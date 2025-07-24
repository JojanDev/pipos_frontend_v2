import { error, loginSuccess } from "../../../helpers/alertas";
import { post } from "../../../helpers/api";
import {
  configurarValidaciones,
  validarAlfanumericos,
  validarCampo,
  validarCampos,
  validarContrasena,
} from "../../../helpers/validaciones";

//Funcion para validar los datos de inicio de sesion
const validarSesion = async (userInput, passwdInput) => {
  //Se realiza la peticion
  const response = await post("personal/login", {
    usuario: userInput.value,
    contrasena: passwdInput.value,
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
  //Se obtienen los datos ingresados
  const userInput = document.querySelector("#usuario");
  const passwdInput = document.querySelector("#contrasena");

  // userInput.addEventListener("blur", validarCampo);
  // userInput.addEventListener("input", (e) => {
  //   validarCampo(e);
  //   validarAlfanumericos(e);
  // });

  // passwdInput.addEventListener("blur", validarCampo);
  // passwdInput.addEventListener("input", (e) => {
  //   validarCampo(e);
  //   validarContrasena(e.target);
  // });
  configurarValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    if (await validarSesion(userInput, passwdInput)) {
      localStorage.setItem("isAuthenticated", "true");
      window.location.hash = "#/inicio";
    }
  });
};
