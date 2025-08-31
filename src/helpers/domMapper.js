import { capitalizarPrimeraLetra } from "./diseño";

/**
 * Rellena automáticamente los elementos dentro de un contenedor HTML
 * con valores obtenidos de un objeto de datos.
 *
 * - Los elementos deben tener atributo `id`, ya que este se usará como
 *   clave para buscar el valor correspondiente en el objeto `data`.
 * - Soporta:
 *   - <select>: selecciona automáticamente la opción correspondiente.
 *   - <input>, <textarea>: asigna el valor directamente.
 *   - Elementos de texto (<p>, <span>, <div>, <h1>, etc.): asigna el texto.
 *
 * @param {Object} data - Objeto con los datos a mapear.
 *                        Cada propiedad debe coincidir con el `id` de un elemento.
 * @param {HTMLElement} container - Contenedor que agrupa los elementos a rellenar.
 */
export const mapearDatosEnContenedor = (data, container) => {
  // Selecciona todos los elementos dentro del contenedor que tengan atributo 'id'
  const elements = container.querySelectorAll("[id]");

  // Recorre cada elemento encontrado
  elements.forEach((element) => {
    const id = element.id; // Obtiene el ID del elemento actual

    // Si no existe una propiedad en `data` con ese ID, se omite el elemento
    if (!(id in data)) return;

    // Obtiene el valor correspondiente desde el objeto `data`
    const value = data[id];

    // --- Caso 1: el elemento es un <select> ---
    if (element.tagName === "SELECT") {
      const valueStr = String(value); // Convierte a string para comparación consistente
      let found = false;

      // Recorre todas las opciones del <select>
      Array.from(element.options).forEach((option) => {
        if (option.value === valueStr) {
          // Marca la opción como seleccionada si coincide
          option.selected = true;
          found = true;
        } else {
          // Deselecciona opciones que no coincidan
          option.selected = false;
        }
      });

      // Si ningún valor coincidió, selecciona la primera opción por defecto
      if (!found) element.selectedIndex = 0;

      // --- Caso 2: inputs, textareas, etc. ---
    } else {
      // Si el elemento tiene la propiedad `value` (ej: input, textarea)
      if ("value" in element) {
        element.value = value;
      } else {
        // Para elementos de solo texto (p, div, span, h1, etc.)
        element.textContent = value;
      }
    }
  });
};
