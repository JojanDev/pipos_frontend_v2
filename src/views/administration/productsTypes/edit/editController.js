import {
  get, // para obtener datos desde el backend
  put, // para actualizar via PUT
  configurarEventosValidaciones, // inicializa validaciones en el formulario
  validarCampos, // valida campos del formulario
  datos, // objeto con los datos recolectados por los helpers/validaciones
  error, // muestra mensaje de error
  successTemporal, // muestra mensaje de éxito temporal
  cerrarModal, // cierra modal por id
  DOMSelector, // selector simplificado del DOM
} from "../../../../helpers";

/**
 * Controlador para editar un tipo de producto.
 * - Carga el tipo actual desde el backend
 * - Permite editar su nombre y enviar la actualización (PUT)
 * - Actualiza la UI (fila de la tabla y título) y cierra el modal
 *
 * @param {Object|null} parametros - Parámetros de la vista (debe contener `perfil` con el tipo de producto).
 * @returns {Promise<void>}
 */
export const editProductTypeController = async (parametros = null) => {
  // Extrae el perfil del tipo de producto (si no llega, queda undefined)
  const { perfil: tipoProducto } = parametros ?? {};

  // Si no hay tipo de producto, no continuar
  if (!tipoProducto || !tipoProducto.id) return;

  // Contenedor/modal de la vista (para escuchar eventos de cierre)
  const contenedorVista = DOMSelector(`[data-modal="edit-productType"]`);

  // Formulario de edición
  const form = DOMSelector("#form-edit-productType");

  // Input donde se muestra/edita el nombre del tipo
  const inputNombreTipo = DOMSelector("#nombreTipo");

  // Carga los datos actuales del tipo desde el backend (asegura datos frescos)
  const getTipoProducto = await get(`tipos-productos/${tipoProducto.id}`);

  // Pone el nombre actual en el input
  inputNombreTipo.value = getTipoProducto.data.nombre;

  // Inicializa validaciones y eventos del formulario
  configurarEventosValidaciones(form);

  // Listener submit: procesa la actualización del tipo de producto
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita el envío por defecto

    // Si la validación falla, no continuar
    if (!validarCampos(e)) return;

    // Si el nombre no cambió, cierra modal y regresa sin llamar al backend
    if (getTipoProducto.data.nombre == datos.nombre) {
      cerrarModal("edit-productType");
      history.back();
      return;
    }

    // Llama al endpoint PUT para actualizar el tipo
    const responseTipo = await put(`tipos-productos/${tipoProducto.id}`, datos);

    // Si falla la petición, muestra el error
    if (!responseTipo.success) {
      await error(responseTipo.message);
      return;
    }

    // Muestra mensaje de éxito temporal
    successTemporal(responseTipo.message);

    // Actualiza la celda correspondiente en la fila de la tabla (si existe)
    const nombreTipoFila = DOMSelector(
      `#productsTypes [data-id="${tipoProducto.id}"] td:nth-child(2)`
    );
    if (nombreTipoFila) {
      nombreTipoFila.textContent = responseTipo.data.nombre;
    }

    // Actualiza el título de la vista/perfil si está presente
    const productTypeTitleEl = DOMSelector("#productType-title");
    if (productTypeTitleEl) {
      productTypeTitleEl.textContent = responseTipo.data.nombre;
    }

    // Cierra el modal y vuelve en el historial
    cerrarModal("edit-productType");
    history.back();
  });

  // Listener para el botón de volver/cerrar dentro del modal
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-productType") {
      cerrarModal("edit-productType");
      history.back();
    }
  });
};
