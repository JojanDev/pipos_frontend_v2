import { url } from "./api";

/**
 * Verifica si el usuario está autenticado.
 *
 * Realiza un GET a 'auth/protected'. Si el token expiró, intenta renovarlo
 * con refreshToken() y vuelve a verificar. En caso de error de autenticación
 * o falla en la renovación, retorna false.
 *
 * @returns {Promise<boolean>}
 *   true si la verificación fue exitosa; false en caso contrario.
 */
export const isAuth = async () => {
  try {
    // Petición inicial al endpoint protegido
    const res = await fetch(`${url}auth/protected`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data.success) {
      return true;
    }

    // Manejo de errores de autenticación
    switch (data.authError) {
      case "TOKEN_EXPIRED":
        // Intentar renovar token
        const renewed = await refreshToken();
        if (!renewed) {
          return false;
        }
        // Reintentar verificación tras renovación
        const retryRes = await fetch(`${url}auth/protected`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const retryData = await retryRes.json();
        return retryData.success;

      case "TOKEN_INVALID":
      case "TOKEN_MISSING":
        // Token inválido o ausente
        return false;

      default:
        // Cualquier otro error de autenticación
        return false;
    }
  } catch (err) {
    console.error("Error al verificar autenticación:", err.message);
    return false;
  }
};

/**
 * Renueva el token de autenticación.
 *
 * Realiza un GET a 'auth/refresh' con credenciales incluidas. Retorna true
 * si la renovación fue exitosa; false en caso de error.
 *
 * @returns {Promise<boolean>}
 */
const refreshToken = async () => {
  try {
    const res = await fetch(`${url}auth/refresh`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error("Error al renovar token:", err.message);
    return false;
  }
};
