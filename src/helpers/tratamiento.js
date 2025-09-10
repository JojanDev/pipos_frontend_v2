/**
 * Convierte un total de días en años, meses, semanas y días restantes.
 *
 * @param {number} dias - Número total de días a convertir.
 * @returns {Object} Objeto con las siguientes propiedades:
 *   - anios {number}     Número de años completos.
 *   - meses {number}     Número de meses completos tras descontar años.
 *   - semanas {number}   Número de semanas completas tras descontar meses.
 *   - dias {number}      Días sobrantes tras descontar años, meses y semanas.
 *   - toString {Function} Retorna una cadena legible con las partes que sean > 0.
 *
 * @example
 * const resultado = convertirDias(800);
 * console.log(resultado.anios);    // 2
 * console.log(resultado.meses);    // 2
 * console.log(resultado.semanas);  // 1
 * console.log(resultado.dias);     // 1
 * console.log(resultado.toString()); // "2 anios, 2 meses, 1 sem, 1 dia"
 */
export function convertirDias(dias) {
  // Calcular años completos y resto de días
  const anios = Math.floor(dias / 365);
  dias = dias % 365;

  // Calcular meses completos y resto de días
  const meses = Math.floor(dias / 30);
  dias = dias % 30;

  // Calcular semanas completas y resto de días
  const semanas = Math.floor(dias / 7);
  dias = dias % 7;

  return {
    anios,
    meses,
    semanas,
    dias,
    /**
     * Construye una cadena con cada parte distinta de cero.
     *
     * @returns {string} Texto con formato "X anios, Y meses, Z sem, W dias"
     */
    toString() {
      const partes = [];

      if (anios > 0) {
        partes.push(`${anios} anio${anios > 1 ? "s" : ""}`);
      }
      if (meses > 0) {
        partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);
      }
      if (semanas > 0) {
        partes.push(`${semanas} sem`);
      }
      if (dias > 0) {
        partes.push(`${dias} dia${dias > 1 ? "s" : ""}`);
      }

      // Si no hay ninguna parte, devolver "0 dias"
      return partes.length > 0 ? partes.join(", ") : "0 dias";
    },
  };
}
