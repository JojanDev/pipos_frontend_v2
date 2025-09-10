/**
 * Capitaliza la primera letra de una cadena de texto.
 *
 * @param {string} palabra - Texto de entrada.
 * @returns {string} La misma cadena con su primera letra en mayúscula.
 */
export const capitalizarPrimeraLetra = (palabra) => {
  if (!palabra) return "";
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);
};

/**
 * Formatea un número como moneda COP, usando puntos como separador de miles.
 *
 * @param {number} precio - Valor numérico a formatear.
 * @returns {string} Cadena con el precio formateado en pesos colombianos.
 */
export const formatearPrecioConPuntos = (precio) => {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  return formatter.format(precio);
};

/**
 * Convierte una fecha a formato compatible con el atributo value de un input[type="date"].
 *
 * @param {string|Date} fecha - Fecha en formato ISO, timestamp o instancia Date.
 * @returns {string} Cadena en formato "YYYY-MM-DD".
 */
export const toInputDate = (fecha) =>
  new Date(fecha).toISOString().split("T")[0];
