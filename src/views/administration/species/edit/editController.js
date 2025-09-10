import {
  get, // GET al backend
  put, // PUT al backend
  configurarEventosValidaciones, // inicializa validaciones en el formulario
  validarCampos, // valida campos del formulario
  datos, // objeto con los datos recolectados por los helpers/validaciones
  error, // muestra mensaje de error
  successTemporal, // muestra mensaje de éxito temporal
  cerrarModal, // cierra modal por id
  DOMSelector, // selector simplificado del DOM
} from "../../../../helpers";

/**
 * Controlador para editar una especie.
 * - Carga la especie actual desde el backend
 * - Permite editar su nombre y enviar la actualización (PUT)
 * - Actualiza la UI (fila de la tabla y título) y cierra el modal
 *
 * @param {Object|null} parametros - Parámetros de la vista (debe contener `perfil` con la especie).
 * @returns {Promise<void>}
 */
export const editSpecieController = async (parametros = null) => {
  // Extrae el perfil de la especie desde los parámetros
  const { perfil: especie } = parametros ?? {};

  // Si no hay especie válida, salir
  if (!especie || !especie.id) return;

  // Contenedor/modal de la vista (para escuchar eventos de cierre)
  const contenedorVista = DOMSelector(`[data-modal="edit-specie"]`);

  // Formulario de edición
  const form = DOMSelector("#form-edit-specie");

  // Input donde se muestra/edita el nombre de la especie
  const inputNombreSpecie = DOMSelector("#nombreSpecie");

  // Carga los datos actuales de la especie desde el backend (asegura información fresca)
  const especieResponse = await get(`especies/${especie.id}`);

  // Si la carga falla, informa, cierra modal y regresa
  if (!especieResponse.success) {
    await error(especieResponse.message);
    cerrarModal("edit-specie");
    history.back();
    return;
  }

  // Rellena el input con el nombre actual
  if (inputNombreSpecie) inputNombreSpecie.value = especieResponse.data.nombre;

  // Inicializa validaciones y eventos del formulario
  configurarEventosValidaciones(form);

  // Listener submit: procesa la actualización de la especie
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita envío tradicional

    // Si la validación falla, no continuar
    if (!validarCampos(e)) return;

    // Si el nombre no cambió, cerrar modal y volver sin llamar al backend
    if (especieResponse.data.nombre == datos.nombre) {
      cerrarModal("edit-specie");
      history.back();
      return;
    }

    // Llama al endpoint PUT para actualizar la especie
    const responseEspecie = await put(`especies/${especie.id}`, datos);

    // Si falla la petición, muestra el error
    if (!responseEspecie.success) {
      await error(responseEspecie.message);
      return;
    }

    // Muestra mensaje de éxito temporal
    successTemporal(responseEspecie.message);

    // Actualiza la celda correspondiente en la fila de la tabla (si existe)
    const nombreEspecieFila = DOMSelector(
      `#species [data-id="${especie.id}"] td:nth-child(2)`
    );
    if (nombreEspecieFila) {
      nombreEspecieFila.textContent = responseEspecie.data.nombre;
    }

    // Actualiza el título de la vista/perfil si está presente
    const specieTitleEl = DOMSelector("#specie-title");
    if (specieTitleEl) specieTitleEl.textContent = responseEspecie.data.nombre;

    // Cierra el modal y vuelve en el historial
    cerrarModal("edit-specie");
    history.back();
  });

  // Listener para el botón de volver/cerrar dentro del modal
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-specie") {
      cerrarModal("edit-specie");
      history.back();
    }
  });
};
