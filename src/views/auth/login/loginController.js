import {
  error,
  loginSuccess,
  post,
  configurarEventosValidaciones,
  datos,
  validarAlfanumericos,
  validarCampos,
} from "../../../helpers";
// import { layoutController } from "../../../layouts/layout";

//Funcion para validar los datos de inicio de sesion
const validarSesion = async ({ usuario, contrasena }) => {
  //Se realiza la peticion
  const response = await post("auth/login", {
    usuario,
    contrasena,
  });

  console.log(response);

  //Se valida el inicio exitoso
  if (response.code == 200) {
    //Se muestra un mensaje
    // localStorage.clear();
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("data", JSON.stringify(response.data));
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
  localStorage.clear();
  const form = document.querySelector("#form");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("hoal");
    // localStorage.setItem("isAuthenticated", true);

    if (!validarCampos(e)) return;

    if (await validarSesion(datos)) {
      window.location.hash = "#/inicio";
    }
  });
};
