/**
 * Selecciona el primer elemento del DOM que coincida con el selector CSS.
 *
 * @param {string} selector - Cadena de consulta CSS.
 * @returns {Element|null} El primer elemento que coincida o null si no existe.
 */
export const DOMSelector = (selector) => document.querySelector(selector);

/**
 * Selecciona todos los elementos del DOM que coincidan con el selector CSS.
 *
 * @param {string} selector - Cadena de consulta CSS.
 * @returns {NodeListOf<Element>} Lista de elementos que coincidan; vacía si no hay ninguno.
 */
export const DOMSelectorAll = (selector) => document.querySelectorAll(selector);

/**
 * Rellena elementos dentro de un contenedor usando datos de un objeto.
 *
 * Cada elemento debe tener atributo `id`, que se usa para buscar la
 * propiedad correspondiente en `data`. Soporta:
 * - <select>: selecciona la opción cuyo valor coincida con `data[id]`.
 * - <input> y <textarea>: asigna `value` a partir de `data[id]`.
 * - Elementos de solo texto (<p>, <span>, <div>, <h1>, etc.): asigna `textContent`.
 *
 * @param {Object} containerData - Objeto con pares clave–valor donde clave coincide con el `id` del elemento.
 * @param {HTMLElement} container - Elemento raíz dentro del cual se buscarán elementos con `id`.
 */
export const mapearDatosEnContenedor = (containerData, container) => {
  // Obtener todos los nodos que tengan atributo id, dentro del contenedor
  const elements = container.querySelectorAll("[id]");

  elements.forEach((element) => {
    const id = element.id;

    // Si no hay dato asociado con este id, omitir
    if (!(id in containerData)) return;

    const value = containerData[id];

    // Caso <select>: buscar opción cuyo value coincida con el dato
    if (element.tagName === "SELECT") {
      const valueStr = String(value);
      let matched = false;

      Array.from(element.options).forEach((option) => {
        if (option.value === valueStr) {
          option.selected = true;
          matched = true;
        } else {
          option.selected = false;
        }
      });

      // Si ninguna opción coincidió, volver a índice 0
      if (!matched) {
        element.selectedIndex = 0;
      }
    } else {
      // Para inputs, textareas y otros elementos que tienen propiedad value
      if ("value" in element) {
        element.value = value;
      } else {
        // Para elementos de solo texto
        element.textContent = value;
      }
    }
  });
};
