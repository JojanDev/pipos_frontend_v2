import { layoutController } from "../layouts/layout";
import { DOMSelector } from "./domMapper";

/**
 * Carga y renderiza el layout principal de la aplicación.
 *
 * - Recupera el HTML de `mainLayout.html` mediante fetch.
 * - Inserta el contenido en el elemento con id "app".
 * - Ejecuta layoutController() para inicializar permisos, menús y eventos.
 *
 * @returns {Promise<void>}
 *   Se resuelve una vez que el HTML se ha insertado y se ha ejecutado layoutController.
 */
export const renderLayout = async () => {
  const response = await fetch(`./src/layouts/mainLayout.html`);
  const html = await response.text();
  DOMSelector("#app").innerHTML = html;

  await layoutController();
};

/**
 * Carga y renderiza la vista de "No encontrado" (404).
 *
 * - Recupera el HTML de `notFound/index.html` mediante fetch.
 * - Inserta el contenido en el elemento con id "app".
 *
 * @returns {Promise<void>}
 *   Se resuelve una vez que el HTML de la vista 404 se ha insertado.
 */
export const renderNotFound = async () => {
  const response = await fetch(`./src/views/notFound/index.html`);
  const html = await response.text();
  DOMSelector("#app").innerHTML = html;
};
