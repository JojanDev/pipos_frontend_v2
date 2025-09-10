// Helpers
import {
  crearCardServicio,
  del,
  DOMSelector,
  error,
  get,
  mostrarPlaceholderServicios,
  successTemporal,
} from "../../helpers";

// Permissions
import hasPermission from "../../helpers/hasPermission";

/**
 * Obtiene la lista de servicios desde la API y los renderiza como cards.
 *
 * @param {HTMLElement} contenedor - Elemento donde se insertan las cards.
 * @returns {Promise<void>}
 *   No retorna valor; limpia el contenedor, muestra un placeholder si no hay datos,
 *   o añade una card por cada servicio recuperado.
 */
const listarServicios = async (contenedor) => {
  // Limpia el contenido previo en el contenedor
  contenedor.innerHTML = "";

  // Si hay un placeholder antiguo, lo elimina
  const placeholderAnterior = contenedor.querySelector(".placeholder");
  if (placeholderAnterior) placeholderAnterior.remove();

  // Petición GET para obtener todos los servicios
  const response = await get("servicios");

  // Si falla o no hay servicios, muestra un placeholder informativo
  if (!response.success || response.data.length === 0) {
    mostrarPlaceholderServicios(contenedor, "No hay servicios registrados.");
    return;
  }

  // Por cada servicio devuelto, crea y añade su card al DOM
  response.data.forEach((servicio) => {
    const card = crearCardServicio(
      servicio.id,
      servicio.nombre,
      servicio.descripcion,
      servicio.precio
    );
    contenedor.appendChild(card);
  });
};

/**
 * Controlador principal para la vista de servicios.
 * Carga los servicios, filtra acciones según permisos y maneja eventos de edición/eliminación.
 *
 * @returns {Promise<void>}
 *   No retorna valor; configura la UI, añade listeners y modifica window.location.hash.
 */
export const servicesController = async () => {
  // Contenedor que agrupa toda la vista de servicios
  const contenedorVista = DOMSelector("#vista-servicios");
  // Contenedor en el que se muestran las cards de servicio
  const contenedorServicios = DOMSelector("#services");

  // Renderiza las cards de servicio en pantalla
  await listarServicios(contenedorServicios);

  // Filtra botones u opciones que requieran permisos especiales
  const acciones = Array.from(
    contenedorVista.querySelectorAll("[data-permiso]")
  );
  acciones.forEach((accion) => {
    const permisosRequeridos = accion.dataset.permiso.split(",");
    if (!hasPermission(permisosRequeridos)) {
      accion.remove();
    }
  });

  // Agrega listener para gestionar edición y eliminación de servicios
  contenedorServicios.addEventListener("click", async (event) => {
    // Determina la card más cercana al elemento clicado
    const card = event.target.closest(".card");
    if (!card) return;

    // Obtiene el ID del servicio de su data attribute
    const idServicio = card.dataset.id;

    // Si se clicó el botón de editar, navega a la ruta de edición
    if (event.target.closest(".btn-servicio-edit")) {
      const baseHash = location.hash.endsWith("/")
        ? location.hash
        : `${location.hash}/`;
      location.hash = `${baseHash}editar/id=${idServicio}`;
      return;
    }

    // Si se clicó el botón de eliminar, envía petición DELETE
    if (event.target.closest(".btn-servicio-delete")) {
      const response = await del(`servicios/${idServicio}`);

      if (response.success) {
        // Muestra mensaje de éxito temporal
        successTemporal(response.message);

        // Elimina la card del DOM
        const cardEliminada = DOMSelector(`.card[data-id="${idServicio}"]`);
        if (cardEliminada) cardEliminada.remove();

        // Si ya no quedan cards, muestra placeholder
        const cardsRestantes = contenedorServicios.querySelectorAll(".card");
        if (cardsRestantes.length === 0) {
          mostrarPlaceholderServicios(
            contenedorServicios,
            "No hay servicios registrados."
          );
        }
      } else {
        // Muestra mensaje de error si la eliminación falla
        await error(response.message);
      }
    }
  });
};
