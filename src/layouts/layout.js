import { capitalizarPrimeraLetra } from "../helpers/diseño";
import { get } from "../helpers/api";
import getCookie from "../helpers/getCookie";
import { DOMSelector, DOMSelectorAll } from "../helpers";
import hasPermission from "../helpers/hasPermission";

export const layoutController = async () => {
  const [...acciones] = DOMSelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }


  const { usuario: credencialUsuario } = getCookie("usuario");
  // console.log(credencialUsuario);

  const { data: usuario } = await get(`usuarios/${credencialUsuario.usuario_id}`);

  const rolesUsuario = await get(`roles-usuarios/usuario/${usuario.id}`);
  const contenedorRoles = DOMSelector(".contenedor-roles");

  console.log(rolesUsuario);

  if (rolesUsuario.success) {
    rolesUsuario.data.forEach(async (rolUsuario) => {
      const pRol = document.createElement("p");
      pRol.classList.add("roles");
      const { data: rol } = await get(`roles/${rolUsuario.rol_id}`);
      console.log(rol);

      pRol.textContent = capitalizarPrimeraLetra(rol.nombre);
      contenedorRoles.append(pRol);
    });
  }

  const nombreEmpleado = DOMSelector("#empleado-nombre-header");
  nombreEmpleado.textContent = usuario.nombre;

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
