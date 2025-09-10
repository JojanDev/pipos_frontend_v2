import {
  post, // para crear el recurso en el backend
  configurarEventosValidaciones, // inicializa validaciones en el formulario
  datos, // objeto con los datos recolectados por las validaciones/helpers
  validarCampos, // valida campos del formulario
  crearFila, // crea una fila DOM para tablas
  successTemporal, // muestra mensaje de éxito temporal
  error, // muestra mensaje de error
  DOMSelector, // selector simplificado del DOM
  cerrarModal, // cierra modal por id
} from "../../../../helpers";

/**
 * Controlador para crear un tipo de producto.
 * - Configura validaciones del formulario
 * - Envía petición POST para crear el tipo de producto
 * - Actualiza la tabla en la UI insertando la fila nueva y eliminando placeholders
 *
 * @param {Object|null} parametros - Parámetros opcionales desde la vista.
 */
export const createProductTypeController = (parametros = null) => {
  // Contenedor/modal de la vista (se usa para escuchar el botón de volver)
  const contenedorVista = DOMSelector(`[data-modal="create-productType"]`);

  // Selecciona el formulario de registro
  const form = DOMSelector("#form-register-productType");

  // Inicializa reglas y eventos de validación en el formulario
  configurarEventosValidaciones(form);

  // Listener submit: procesa la creación del tipo de producto
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita envío por defecto del formulario

    // Valida campos; si falla, detiene el flujo
    if (!validarCampos(e)) return;

    // Envía la petición POST con los datos recolectados
    const responseTipoProducto = await post("tipos-productos", datos);

    // Si falla la creación, muestra el error
    if (!responseTipoProducto.success) {
      await error(responseTipoProducto.message);
      return;
    }

    // Muestra mensaje de éxito temporal
    successTemporal(responseTipoProducto.message);

    // Actualiza la tabla en la UI: inserta la nueva fila y elimina placeholder si existe
    const tbody = DOMSelector("#productsTypes .table__body");
    if (tbody) {
      // Elimina el placeholder si estaba presente
      const placeholder = tbody.querySelector(".placeholder");
      if (placeholder) placeholder.remove();

      // Crea la fila con los datos devueltos por el backend e la inserta al inicio
      const { id, nombre } = responseTipoProducto.data;
      const row = crearFila([id, nombre]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    // Cierra el modal y regresa en el historial
    cerrarModal("create-productType");
    history.back();
  });

  // Listener para el botón de volver/cerrar dentro del modal
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-register-productType") {
      cerrarModal("create-productType");
      history.back();
    }
  });
};
