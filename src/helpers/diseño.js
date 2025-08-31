export const capitalizarPrimeraLetra = (palabra) => {
  if (!palabra) return "";
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);
};

export const formatearPrecioConPuntos = (precio) => {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  return formatter.format(precio);
};
