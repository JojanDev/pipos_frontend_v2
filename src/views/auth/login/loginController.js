// Helpers
import {
  error,
  post,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  successTemporal,
} from "../../../helpers";

/**
 * Controlador para gestionar el inicio de sesión de usuarios.
 * Configura validaciones del formulario, envía credenciales y redirige tras login exitoso.
 *
 * @returns {Promise<void>} - No retorna valor; controla validaciones, muestra mensajes y cambia la ruta.
 *
 */
export const loginController = async () => {
  // Referencia al formulario de login
  const form = document.querySelector("#form");

  // Configura validaciones de campos al interactuar con el formulario
  configurarEventosValidaciones(form);

  // Listener para el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Si la validación de campos falla, no continuamos
    if (!validarCampos(e)) return;

    // Intentamos iniciar sesión con los datos del formulario
    if (await validarSesion(datos)) {
      // Redirigimos al panel de inicio tras login exitoso
      window.location.hash = "#/inicio";
    }
  });
};

/**
 * Envía las credenciales al backend y procesa la respuesta de inicio de sesión.
 *
 * @param {Object} creds - Objeto con usuario y contraseña.
 * @param {string} creds.usuario - Nombre de usuario.
 * @param {string} creds.contrasena - Contraseña del usuario.
 * @returns {Promise<boolean>} - True si login exitoso; false en caso de error (muestra mensaje).
 *
 */
const validarSesion = async ({ usuario, contrasena }) => {
  // Enviamos petición de autenticación al servidor
  const response = await post("auth/login", { usuario, contrasena });

  // En caso de éxito, mostramos mensaje y devolvemos true
  if (response.success) {
    successTemporal(response.message);
    return true;
  }

  // En caso de error, mostramos mensaje y devolvemos false
  await error(response.message);
  return false;
};
