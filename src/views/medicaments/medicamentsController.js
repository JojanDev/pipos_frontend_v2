// Helpers
import { DOMSelector, get } from "../../helpers";
import hasPermission from "../../helpers/hasPermission";
import { crearCartaMedicamento } from "../../helpers/infoMedicamento";

/**
 * Controlador para la vista de información de medicamentos.
 * Recupera datos de la API, renderiza una carta por medicamento, filtra acciones según permisos
 * y maneja la navegación a la vista de perfil individual del medicamento.
 *
 * @returns {Promise<void>}
 *   No retorna valor; modifica el DOM y cambia window.location.hash según interacciones.
 *
 */
export const medicamentsController = async () => {
  // Contenedor principal de las cartas de medicamentos
  const contenedor = DOMSelector("#medicaments-info");

  // Obtenemos la lista de info-medicamentos desde la API
  const response = await get("info-medicamentos");

  // Por cada medicamento, creamos y añadimos su carta al contenedor
  response.data.forEach((medicamento) => {
    const carta = crearCartaMedicamento(medicamento);
    contenedor.appendChild(carta);
  });

  // Referencias adicionales para filtrar permisos y manejar eventos
  const contenedorVista = DOMSelector("#vista-info-medicamento");
  const contenedorMedicaments = contenedor;

  // Filtramos los elementos con data-permiso según los permisos del usuario
  Array.from(contenedorVista.querySelectorAll("[data-permiso]")).forEach(
    (accion) => {
      const permisosRequeridos = accion.dataset.permiso.split(",");
      if (!hasPermission(permisosRequeridos)) {
        accion.remove();
      }
    }
  );

  // Manejador de clic para navegar al perfil de un medicamento concreto
  contenedorMedicaments.addEventListener("click", (event) => {
    const carta = event.target.closest(".card[data-id]");
    if (!carta) return;

    // Construimos el nuevo hash para la navegación
    const idInfo = carta.getAttribute("data-id");
    const baseHash = location.hash.endsWith("/")
      ? location.hash
      : `${location.hash}/`;
    location.hash = `${baseHash}perfil/id=${idInfo}`;
  });
};
