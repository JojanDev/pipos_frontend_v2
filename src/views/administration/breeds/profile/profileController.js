import {
  error,
  get,
  cerrarModal,
  del,
  DOMSelector,
  successTemporal,
} from "../../../../helpers";
import {
  especiesConRazas,
  mostrarMensajePlaceholderRazas,
} from "../../administrationController";

/**
 * Controlador del perfil de una raza.
 * - Carga los datos de la raza desde el backend
 * - Población del título y especie en la UI
 * - Maneja acciones: editar, eliminar y volver
 *
 * @param {Object|null} parametros - Parámetros enviados desde la vista (debe contener `perfil` con la raza).
 * @returns {Promise<void>}
 */
export const profileBreedController = async (parametros = null) => {
  // Extrae la raza (perfil) desde los parámetros
  const { perfil: raza } = parametros ?? {};

  // Si no se pasó la raza, no continuar
  if (!raza || !raza.id) return;

  // Selecciona el contenedor/modal correspondiente para escuchar eventos
  const contenedorVista = DOMSelector('[data-modal="breed-profile"]');

  // Obtiene la raza actual desde el backend (asegura datos frescos)
  const getRaza = await get(`razas/${raza.id}`);

  // Si la petición falla, muestra el error, cierra modal y regresa
  if (!getRaza.success) {
    await error(getRaza.message);
    cerrarModal("breed-profile");
    history.back();
    return;
  }

  // Selecciona elementos del DOM donde se mostrará el título y la especie
  const titulo = DOMSelector("#breed-title");
  const especieNombre = DOMSelector("#breed-specie");

  // Rellena los textos con los datos obtenidos
  titulo.textContent = getRaza.data.nombre;
  especieNombre.textContent = `Raza de la especie ${getRaza.data.especie.nombre}`;

  // Escucha eventos dentro del contenedor (editar, eliminar, volver)
  contenedorVista.addEventListener("click", async (e) => {
    // EDITAR: redirige a la ruta de edición relativa
    if (e.target.id == "edit-breed") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
      return;
    }

    // ELIMINAR: realiza petición DELETE y actualiza UI + memoria local
    if (e.target.id == "delete-breed") {
      // Llama al endpoint para eliminar la raza
      const response = await del(`razas/${raza.id}`);

      // Si la eliminación fue exitosa, actualiza UI y memoria
      if (response.success) {
        // Muestra mensaje de éxito temporal
        successTemporal(response.message);

        // Selecciona el tbody de razas en la UI
        const razasTbody = DOMSelector("#breeds .table__body");

        // Localiza la fila correspondiente a la raza y la elimina visualmente
        const row = razasTbody.querySelector(`[data-id='${raza.id}']`);

        // Actualiza el array global especiesConRazas quitando la raza eliminada
        const especie = especiesConRazas.find(
          (e) => e.id === getRaza.data.especie_id
        );
        if (especie) {
          especie.razas = especie.razas.filter((r) => r.id !== getRaza.data.id);
        }

        // Si la especie quedó sin razas, muestra el placeholder correspondiente
        if (!especie || especie.razas.length === 0) {
          mostrarMensajePlaceholderRazas(
            "No hay razas registradas para esta especie"
          );
        }

        // Remueve la fila del DOM si existe
        if (row) row.remove();

        // Cierra modal y vuelve en el historial
        cerrarModal("breed-profile");
        history.back();
        return;
      }

      // Si la petición falló, muestra el error
      await error(response.message);
      return;
    }

    // VOLVER: cierra modal y vuelve en el historial
    if (e.target.id == "back-breed-profile") {
      cerrarModal("breed-profile");
      history.back();
      return;
    }
  });
};
