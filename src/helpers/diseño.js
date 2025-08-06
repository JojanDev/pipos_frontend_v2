export const capitalizarPrimeraLetra = (palabra) => {
  if (!palabra) return "";
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);
};

export const formatearPrecioConPuntos = (precio) => {
  return precio.toLocaleString("es-CO");
};
