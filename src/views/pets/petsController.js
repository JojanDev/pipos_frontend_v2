import { get, crearFila, error, DOMSelector } from "../../helpers";
import hasPermission from "../../helpers/hasPermission";
import { formatoCorto } from "../ventas/profile/profileController";

/**
 * Controlador para gestionar la vista de mascotas.
 * Filtra las acciones disponibles según permisos, carga la lista de mascotas
 * en la tabla y maneja la navegación al perfil de cada mascota.
 *
 * @returns {Promise<void>} No retorna valor; actualiza el DOM y modifica window.location.hash.
 *
 */
export const petsController = async () => {
  // Seleccionamos el contenedor principal y recogemos todos los elementos con data-permiso
  const contenedorVista = DOMSelector("#mascotas");
  const acciones = Array.from(
    contenedorVista.querySelectorAll("[data-permiso]")
  );

  console.log(acciones);

  // Filtramos cada acción según los permisos del usuario
  for (const accion of acciones) {
    const permisosRequeridos = accion.dataset.permiso.split(",");
    console.log(permisosRequeridos);
    console.log(hasPermission(permisosRequeridos));
    if (!hasPermission(permisosRequeridos)) {
      accion.remove();
    }
  }

  // Preparamos referencias a la tabla de mascotas
  const tbody = DOMSelector("#pets .table__body");
  const tablaPets = DOMSelector("#pets");

  // Obtenemos datos de mascotas desde la API
  const petsResponse = await get("mascotas");
  console.log(petsResponse);

  // Si la petición falla, mostramos error y abortamos
  if (!petsResponse.success) {
    await error(petsResponse.message);
    return;
  }

  // Por cada mascota, creamos una fila con los datos relevantes
  petsResponse.data.forEach(
    ({
      id,
      nombre,
      raza,
      cliente,
      especie,
      telefono,
      ultimo_antecedente,
      estado_vital,
    }) => {
      const fechaString = ultimo_antecedente
        ? formatoCorto(ultimo_antecedente)
        : "Sin registros"; // Sin fecha de último antecedente aún
      const row = crearFila([
        id,
        nombre,
        especie,
        raza,
        cliente,
        telefono,
        fechaString,
      ]);

      // Si la mascota está muerta, marcamos la fila en rojo
      if (!estado_vital) {
        row.classList.add("fila-roja");
      }

      tbody.append(row);
    }
  );

  // Listener para navegar al perfil de la mascota al hacer clic en una fila
  tablaPets.addEventListener("click", (e) => {
    const fila = e.target.closest("tr[data-id]");
    if (!fila) return;

    // Obtenemos el id de la mascota desde el atributo data-id
    const idPet = fila.getAttribute("data-id");

    // Verificamos permiso de lectura antes de navegar
    if (!hasPermission(["mascota.read"])) {
      return;
    }

    // Construimos y asignamos el nuevo hash para redirigir al perfil
    const baseHash = location.hash.endsWith("/")
      ? location.hash
      : `${location.hash}/`;
    location.hash = `${baseHash}perfil/id=${idPet}`;
  });
};
