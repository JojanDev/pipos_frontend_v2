// Helpers
import { get, crearFila, DOMSelector, error } from "../../helpers";
import hasPermission from "../../helpers/hasPermission";

/**
 * Obtiene la lista de clientes desde la API y la muestra en la tabla.
 *
 * @returns {Promise<void>} - No retorna nada; actualiza el DOM o muestra errores.
 *
 */
const cargarTabla = async () => {
  // Obtenemos la lista de clientes desde la API
  const clientes = await get("usuarios/clientes");

  // Si la respuesta no es exitosa, mostramos error y salimos
  if (!clientes.success) {
    await error(clientes.message);
    return;
  }

  // Seleccionamos y limpiamos el cuerpo de la tabla
  const tbody = DOMSelector("#clients .table__body");
  tbody.innerHTML = "";

  // Creamos y agregamos una fila por cada cliente
  clientes.data.forEach((cliente) => {
    const rowData = [
      cliente.id,
      `${cliente.nombre} ${cliente.apellido}`,
      cliente.telefono,
      cliente.numero_documento,
      cliente.direccion,
    ];
    const row = crearFila(rowData);
    tbody.append(row);
  });
};

/**
 * Controlador principal de la vista de clientes.
 * Carga datos, filtra acciones según permisos y maneja la navegación al perfil de cliente.
 *
 * @returns {Promise<void>} - No retorna nada; controla validaciones de permisos y eventos de UI.
 *
 */
export const clientsController = async () => {
  // Cargamos la tabla con los clientes disponibles
  await cargarTabla();

  // Referencias al contenedor de la tabla y al área de acciones
  const tablaClientes = DOMSelector("#clients");
  const contenedorVista = DOMSelector("#vista-clientes");

  // Filtramos botones y elementos según los permisos del usuario
  const acciones = Array.from(
    contenedorVista.querySelectorAll("[data-permiso]")
  );
  acciones.forEach((accion) => {
    const permisosRequeridos = accion.dataset.permiso.split(",");
    if (!hasPermission(permisosRequeridos)) {
      accion.remove();
    }
  });

  // Al hacer clic en una fila, navegamos al perfil del cliente correspondiente
  tablaClientes.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    if (!fila) return;

    const idCliente = fila.getAttribute("data-id");
    const baseHash = location.hash.endsWith("/")
      ? location.hash
      : `${location.hash}/`;
    location.hash = `${baseHash}perfil/id=${idCliente}`;
  });
};
