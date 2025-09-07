export function convertirDias(dias) {
  const años = Math.floor(dias / 365);
  dias %= 365;

  const meses = Math.floor(dias / 30);
  dias %= 30;

  const sem = Math.floor(dias / 7);
  dias %= 7;

  return {
    años,
    meses,
    sem,
    dias, // lo que sobra en días
    toString() {
      let partes = [];
      if (años) partes.push(`${años} año${años > 1 ? "s" : ""}`);
      if (meses) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);
      if (sem) partes.push(`${sem} sem`);
      if (dias) partes.push(`${dias} día${dias > 1 ? "s" : ""}`);
      return partes.join(", ") || "0 días";
    },
  };
}
