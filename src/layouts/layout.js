// Helpers de diseño y API
import { capitalizarPrimeraLetra } from "../helpers/diseño";
import { get } from "../helpers/api";
import getCookie from "../helpers/getCookie";
import { DOMSelector, DOMSelectorAll } from "../helpers";
import hasPermission from "../helpers/hasPermission";

/**
 * Controlador del layout principal de la aplicación.
 *
 * Filtra elementos según permisos del usuario, muestra roles y nombre en el header,
 * habilita el menú de cuenta y gestiona la acción de logout.
 *
 * @returns {Promise<void>}
 *   No retorna valor; altera el DOM e interactúa con window.location.hash.
 *
 */
export const layoutController = async () => {
  // 1. Filtrar acciones (botones, enlaces) según permisos declarados en data-permiso
  const acciones = DOMSelectorAll("[data-permiso]");
  for (const accion of acciones) {
    const permisosRequeridos = accion.dataset.permiso.split(",");
    if (!hasPermission(permisosRequeridos)) {
      accion.remove();
    }
  }

  // 2. Obtener credenciales del usuario desde la cookie "usuario"
  const { usuario: credencialUsuario } = getCookie("usuario");

  // 3. Consultar datos completos del usuario
  const { data: usuario } = await get(
    `usuarios/${credencialUsuario.usuario_id}`
  );

  // 4. Consultar roles asociados al usuario y mostrarlos en el header
  const rolesUsuario = await get(`roles-usuarios/usuario/${usuario.id}`);
  const contenedorRoles = DOMSelector(".contenedor-roles");

  if (rolesUsuario.success) {
    // Por cada rol-usuario, obtener el nombre del rol y crear un <p> con texto capitalizado
    rolesUsuario.data.forEach(async (rolUsuario) => {
      const pRol = document.createElement("p");
      pRol.classList.add("roles");

      const { data: rol } = await get(`roles/${rolUsuario.rol_id}`);
      pRol.textContent = capitalizarPrimeraLetra(rol.nombre);

      contenedorRoles.append(pRol);
    });
  }

  // 5. Mostrar nombre completo del usuario en el header
  const nombreEmpleado = DOMSelector("#empleado-nombre-header");
  nombreEmpleado.textContent = `${usuario.nombre} ${usuario.apellido}`;

  // 6. Toggle del menú de opciones de cuenta al hacer clic en el botón de cuenta
  const btnCuenta = DOMSelector("#cuenta");
  btnCuenta?.addEventListener("click", () => {
    const opcionesCuenta = DOMSelector(".cuenta-opciones");
    opcionesCuenta.classList.toggle("cuenta-hidden");
  });

  // 7. Listener global en el layout para acciones como logout
  const layout = DOMSelector(".layout");
  layout.addEventListener("click", async (e) => {
    // Si el elemento clicado tiene id "salir-usuario", se cierra sesión
    if (e.target.id === "salir-usuario") {
      await get("auth/logout");
      location.hash = "#/login";
    }
  });
};
