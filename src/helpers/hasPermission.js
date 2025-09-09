import getCookie from "./getCookie";

export default (permisosRequeridos) => {
  const permisosUsuario = getCookie("permisos");
  console.log(permisosUsuario);
  console.log(permisosRequeridos);

  // Extrae los permisos del usuario desde el token decodificado

  // Verifica que el usuario tenga todos los permisos requeridos
  // Verifica si el usuario tiene todos los permisos requeridos
  return permisosRequeridos.some((requerido) => {
    // Para cada permiso requerido, buscamos si el usuario tiene algún permiso que lo cubra
    return permisosUsuario.some((asignado) => {
      // ✅ Coincidencia exacta: el permiso asignado es igual al requerido
      if (asignado === requerido) return true;

      // ✅ Coincidencia con comodín: por ejemplo, "tabla.*" cubre "tabla.crear", "tabla.editar", etc.
      if (asignado.endsWith(".*")) {
        // Extraemos la parte base del permiso, por ejemplo "tabla" desde "tabla.*"
        const base = asignado.replace(".*", "");

        // Verificamos si el permiso requerido comienza con esa base seguida de un punto
        // Ejemplo: "tabla.crear".startsWith("tabla.") → true
        return requerido.startsWith(base + ".");
      }

      // Si no hay coincidencia exacta ni por comodín, este permiso asignado no cubre el requerido
      return false;
    });
  });
};
