import { capitalizarPrimeraLetra } from "../helpers/diseño";
import { get } from "../helpers/api";
import getCookie from "../helpers/getCookie";
import { DOMSelector, DOMSelectorAll } from "../helpers";
import hasPermission from "../helpers/hasPermission";

export const layoutController = async () => {
  // const dataJSON = localStorage.getItem("data");
  // const data = JSON.parse(dataJSON);

  // const getPer = await get("personal/" + data.id);

  const [...acciones] = DOMSelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  // const nombreEmpleado = DOMSelector("#empleado-nombre-header");
  // const rolEmpleado = DOMSelector("#empleado-rol-header");
  // nombreEmpleado.textContent = getPer.data.info.nombre;
  // rolEmpleado.textContent = capitalizarPrimeraLetra(getPer.data.rol.nombre);

  // if (data.id_rol != 1) {
  //   const opcionesAdmin = document.querySelectorAll(".admin");
  //   [...opcionesAdmin].forEach((element) => element.remove());
  // }

  const btnCuenta = DOMSelector("#cuenta");

  btnCuenta?.addEventListener("click", (e) => {
    console.log("Si");

    const btnOpciones = DOMSelector(".cuenta-opciones");

    if (btnOpciones.classList.contains("cuenta-hidden"))
      btnOpciones.classList.remove("cuenta-hidden");
    else btnOpciones.classList.add("cuenta-hidden");
  });

  const layout = DOMSelector(".layout");

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
