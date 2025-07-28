export const capitalizarPrimeraLetra = (palabra) => {
  if (!palabra) return "";
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);
};
