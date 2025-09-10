import {
  error, // muestra mensajes de error
  get, // GET al backend
  cerrarModal, // cierra modal por id
  del, // DELETE al backend
  DOMSelector, // selector simplificado del DOM
  successTemporal, // muestra mensaje de éxito temporal
} from "../../../../helpers";
import hasPermission from "../../../../helpers/hasPermission"; // verifica permisos de usuario

/**
 * Controlador del perfil de tipo de producto.
 * - Carga datos del tipo desde el backend
 * - Renderiza título
 * - Filtra acciones según permisos
 * - Maneja editar, eliminar y volver
 *
 * @param {Object|null} parametros - Parámetros pasados desde la vista (debe contener `perfil` con el tipo).
 * @returns {Promise<void>}
 */
export const profileProductTypeController = async (parametros = null) => {
  // Extrae el perfil del tipo de producto desde los parámetros
  const { perfil: tipoProducto } = parametros ?? {};

  // Si no se recibió el perfil correctamente, no continuar
  if (!tipoProducto || !tipoProducto.id) return;

  // Contenedor/modal de la vista (se usa para escuchar eventos)
  const contenedorVista = DOMSelector(`[data-modal="productType-profile"]`);

  // Modal (misma referencia, nombre distinto por claridad de uso)
  const modal = contenedorVista;

  // Determina si estamos en modal o en ruta directa (no se usa aquí, pero se mantiene la idea)
  const esModal = !location.hash.includes(
    "administrar_datos/tipos_productosPerfil"
  );

  // Obtiene el tipo desde el backend (asegura datos actualizados)
  const response = await get(`tipos-productos/${tipoProducto.id}`);

  // Si la petición falla, mostrar error, cerrar modal y retroceder
  if (!response.success) {
    await error(response.message);
    cerrarModal("productType-profile");
    history.back();
    return;
  }

  // Rellena el título del modal/contenedor con el nombre del tipo
  const titulo = DOMSelector("#productType-title");
  if (titulo) titulo.textContent = response.data.nombre;

  // Filtra acciones en la vista según permisos (attribute: data-permiso)
  const acciones = Array.from(
    contenedorVista.querySelectorAll(`[data-permiso]`)
  );

  for (const accion of acciones) {
    // Asegura que el atributo exista antes de split
    const permisosAttr = accion.dataset.permiso ?? "";
    const permisos = permisosAttr
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    // Si el usuario no tiene ninguno de los permisos requeridos, remueve la acción
    if (permisos.length > 0 && !hasPermission(permisos)) {
      accion.remove();
    }
  }

  // Eventos del modal: editar y eliminar
  modal.addEventListener("click", async (e) => {
    // EDITAR: redirige a la ruta de edición relativa
    if (e.target.id === "edit-productType") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
      return;
    }

    // ELIMINAR: realiza DELETE y actualiza UI si es exitoso
    if (e.target.id === "delete-productType") {
      const responseDel = await del(`tipos-productos/${tipoProducto.id}`);

      if (responseDel.success) {
        // Muestra mensaje de éxito temporal
        successTemporal(responseDel.message);

        // Elimina la fila correspondiente en la tabla principal si existe
        const fila = DOMSelector(
          `#productsTypes [data-id="${tipoProducto.id}"]`
        );
        if (fila) fila.remove();

        // Cierra modal y vuelve en el historial
        cerrarModal("productType-profile");
        history.back();
        return;
      }

      // Si hubo error al eliminar, mostrarlo
      await error(responseDel.message);
      return;
    }
  });

  // Listener para el botón de volver/cerrar dentro del contenedor/modal
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id === "back-productType-profile") {
      cerrarModal("productType-profile");
      history.back();
      return;
    }
  });
};
