import { capitalizarPrimeraLetra } from "../helpers/diseño";
import { get } from "../helpers/api";

export const layoutController = async () => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  const getPer = await get("personal/" + data.id);

  const nombreEmpleado = document.querySelector("#empleado-nombre-header");
  const rolEmpleado = document.querySelector("#empleado-rol-header");
  nombreEmpleado.textContent = getPer.data.info.nombre;
  rolEmpleado.textContent = capitalizarPrimeraLetra(getPer.data.rol.nombre);

  if (data.id_rol != 1) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => element.remove());
  }

  const btnCuenta = document.querySelector("#cuenta");

  btnCuenta?.addEventListener("click", (e) => {
    console.log("Si");

    const btnOpciones = document.querySelector(".cuenta-opciones");

    if (btnOpciones.classList.contains("cuenta-hidden"))
      btnOpciones.classList.remove("cuenta-hidden");
    else btnOpciones.classList.add("cuenta-hidden");
  });

  const layout = document.querySelector(".layout");

  layout.addEventListener("click", (e) => {
    if (e.target.id == "perfil-usuario") {
      // window.location.hash = "#/personal/";
    }

    if (e.target.id == "salir-usuario") {
      localStorage.clear();
      window.location.hash = "#/login/";
    }
  });
};
