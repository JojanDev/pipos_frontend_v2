import getCookie from "./getCookie";

/**
 * Verifica si el usuario posee al menos uno de los permisos requeridos.
 *
 * Admite coincidencia exacta y comodines (por ejemplo, "recurso.*" cubre
 * "recurso.crear", "recurso.editar", etc.).
 *
 * @param {string[]} requiredPermissions - Array de permisos a verificar.
 * @returns {boolean} True si el usuario tiene al menos un permiso requerido.
 */
export default function hasPermission(requiredPermissions) {
  const userPermissions = getCookie("permisos") || [];

  return requiredPermissions.some((required) =>
    userPermissions.some((assigned) => {
      // Coincidencia exacta
      if (assigned === required) {
        return true;
      }
      // Coincidencia con comodín al final ("modulo.*")
      if (assigned.endsWith(".*")) {
        const base = assigned.slice(0, -2);
        return required.startsWith(base + ".");
      }
      return false;
    })
  );
}
