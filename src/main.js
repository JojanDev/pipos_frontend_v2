/**
 * Punto de entrada de la aplicación.
 *
 * - Importa el router de la SPA.
 * - Carga los estilos globales y los iconos de Remix Icon.
 * - Configura listeners para inicializar o actualizar la ruta según eventos del navegador.
 *
 * Efectos secundarios:
 * - Aplica los estilos CSS importados.
 * - Registra listeners en window para manejar navegaciones basadas en hash.
 */

import { router } from "./router/router";
import "./styles/style.css";
import "remixicon/fonts/remixicon.css";

/**
 * Al cargar completamente el DOM, ejecuta el router para renderizar la vista inicial.
 */
window.addEventListener("DOMContentLoaded", async () => {
  await router();
});

/**
 * Cada vez que cambie el hash en la URL, vuelve a invocar el router
 * para renderizar la vista correspondiente a la nueva ruta.
 */
window.addEventListener("hashchange", async () => {
  await router();
});
