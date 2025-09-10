import {
  get,
  crearFila,
  capitalizarPrimeraLetra,
  formatearPrecioConPuntos,
  DOMSelector,
} from "../../helpers";
import hasPermission from "../../helpers/hasPermission";
import { formatoCorto } from "./profile/profileController";

/**
 * Obtiene el listado de ventas desde la API y las muestra en la tabla de ventas.
 * Formatea fechas y montos, y marca con estilo las ventas pendientes.
 *
 * @returns {Promise<void>}
 *   No retorna valor; limpia y llena el tbody de "#ventas .table__body".
 *
 */
const cargarTablaVentas = async () => {
  // Solicitamos las ventas registradas al backend
  const ventasResponse = await get("ventas");
  console.log(ventasResponse);

  // Si la petición falla, salimos sin modificar la tabla
  if (!ventasResponse.success) {
    return;
  }

  // Seleccionamos y vaciamos el cuerpo de la tabla
  const tbody = DOMSelector("#ventas .table__body");
  tbody.innerHTML = "";

  // Preparamos los datos formateados para cada venta
  const ventasInfo = await Promise.all(
    ventasResponse.data.map(async (venta) => {
      // Obtenemos datos del comprador para mostrar su nombre completo
      const { data: usuarioVenta } = await get(
        `usuarios/${venta.comprador_id}`
      );

      return [
        venta.id,
        formatoCorto(venta.fecha_creado), // Fecha con formato corto
        `${usuarioVenta.nombre} ${usuarioVenta.apellido}`, // Nombre completo del comprador
        formatearPrecioConPuntos(venta.monto), // Monto pagado
        formatearPrecioConPuntos(venta.total - venta.monto), // Cambio o saldo restante
        formatearPrecioConPuntos(venta.total), // Total de la venta
        venta.completada ? "Completada" : "Pendiente", // Estado de la venta
      ];
    })
  );

  // Insertamos cada fila y señalizamos las pendientes en naranja
  ventasInfo.forEach((filaDatos) => {
    const row = crearFila(filaDatos);
    if (filaDatos[filaDatos.length - 1] === "Pendiente") {
      row.classList.add("fila-naranja");
    }
    tbody.append(row);
  });
};

/**
 * Controlador principal de la vista de ventas.
 * Carga la tabla de ventas, filtra acciones según permisos y gestiona la navegación al perfil.
 *
 * @returns {Promise<void>}
 *   No retorna valor; configura la UI, filtra elementos y asigna listeners.
 *
 */
export const ventasController = async () => {
  // Renderizamos la tabla con los datos de ventas
  await cargarTablaVentas();

  // Filtramos botones y enlaces de la interfaz según permisos
  const contenedorVista = DOMSelector("#vista-ventas");
  Array.from(contenedorVista.querySelectorAll("[data-permiso]")).forEach(
    (accion) => {
      const permisosRequeridos = accion.dataset.permiso.split(",");
      if (!hasPermission(permisosRequeridos)) {
        accion.remove();
      }
    }
  );

  // Al hacer clic en una fila, navegamos al perfil de la venta correspondiente
  const tablaVentas = DOMSelector("#ventas");
  tablaVentas.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    if (!fila) return;

    // Verificamos permiso de lectura antes de cambiar la ruta
    if (!hasPermission(["venta.read"])) {
      return;
    }

    const idVenta = fila.getAttribute("data-id");
    const baseHash = location.hash.endsWith("/")
      ? location.hash
      : `${location.hash}/`;

    // Actualizamos el hash para dirigir al perfil de la venta
    location.hash = `${baseHash}perfil/id=${idVenta}`;
  });
};
