import { error, loginSuccess } from "../../../helpers/alertas";

//Funcion para validar los datos de inicio de sesion
const validarSesion = async () => {
  //Se obtienen los datos ingresados
  const userInput = document.querySelector("#usuario");
  const passwdInput = document.querySelector("#contrasena");

  //Se realiza la peticion
  const response = await fetch("http://localhost:8081/api/personal/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario: userInput.value,
      contrasena: passwdInput.value,
    }),
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
  const boton = document.querySelector("#access");

  boton.addEventListener("click", async (event) => {
    event.preventDefault();

    if (await validarSesion()) {
      localStorage.setItem("isAuthenticated", "true");
      window.location.hash = "#/inicio";
    }
  });
};
