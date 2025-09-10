// Helpers
import {
  error,
  get,
  del,
  successTemporal,
  DOMSelector,
  cerrarModal,
} from "../../../../helpers";
import hasPermission from "../../../../helpers/hasPermission";

/**
 * Controlador para mostrar el perfil de una especie.
 * Recupera datos de la API, filtra acciones según permisos y maneja eventos de edición, borrado y navegación.
 *
 * @param {Object|null} parametros - Parámetros de entrada para el controlador.
 * @param {Object} parametros.perfil - Perfil de la especie a mostrar.
 * @returns {Promise<void>} - No retorna nada, maneja la vista modal y posibles modales de error.
 *
 */
export const profileSpecieController = async (parametros = null) => {
  // Extraemos el perfil de la especie desde los parámetros
  const { perfil: especie } = parametros;

  // Seleccionamos el contenedor principal del modal de perfil
  const contenedorVista = DOMSelector('[data-modal="specie-profile"]');

  // Petición para obtener datos detallados de la especie
  const response = await get(`especies/${especie.id}`);

  // Si la petición falla, mostramos error, cerramos modal y navegamos atrás
  if (!response.success) {
    await error(response.message);
    cerrarModal("specie-profile");
    history.back();
    return;
  }

  // Actualizamos el título del modal con el nombre de la especie
  const titulo = DOMSelector("#specie-title");
  titulo.textContent = response.data.nombre;

  // Filtramos botones de acción según permisos del usuario
  const acciones = Array.from(
    contenedorVista.querySelectorAll("[data-permiso]")
  );
  for (const accion of acciones) {
    const permisosRequeridos = accion.dataset.permiso.split(",");
    if (!hasPermission(permisosRequeridos)) {
      accion.remove();
    }
  }

  // Manejamos clicks en el modal para editar, borrar o volver
  contenedorVista.addEventListener("click", async (e) => {
    // Editar: navegamos a la ruta de edición
    if (e.target.id === "edit-specie") {
      const needsSlash = location.hash.endsWith("/");
      location.hash = `${location.hash}${needsSlash ? "" : "/"}editar`;
    }

    // Eliminar: petición DELETE y actualizaciones DOM
    if (e.target.id === "delete-specie") {
      const deleteResp = await del(`especies/${especie.id}`);
      if (deleteResp.success) {
        successTemporal(deleteResp.message);
        // Eliminamos la fila correspondiente en la lista principal
        const fila = DOMSelector(`#species [data-id="${especie.id}"]`);
        fila.remove();
        cerrarModal("specie-profile");
        history.back();
      } else {
        await error(deleteResp.message);
      }
    }

    // Volver: cerrar modal y navegar atrás
    if (e.target.id === "back-specie-profile") {
      cerrarModal("specie-profile");
      history.back();
    }
  });
};
