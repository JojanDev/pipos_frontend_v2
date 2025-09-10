// Helpers
import {
  capitalizarPrimeraLetra,
  convertirADiaMesAño,
  crearFila,
  DOMSelector,
  errorTemporal,
  formatearPrecioConPuntos,
  get,
} from "../../helpers";

// Permissions
import hasPermission from "../../helpers/hasPermission";

/**
 * Obtiene el listado de productos desde la API y los muestra en la tabla de inventario.
 *
 * @returns {Promise<void>}
 *   No retorna valor; actualiza el DOM o muestra un mensaje temporal de error.
 *
 */
const listarProductos = async () => {
  // Solicitamos la lista de productos al servidor
  const responseProductos = await get("productos");
  if (!responseProductos.success) {
    // En caso de error, mostramos mensaje temporal y abortamos
    errorTemporal(responseProductos.message);
    return;
  }

  // Seleccionamos y limpiamos la tabla de productos
  const tbody = DOMSelector("#products .table__body");
  tbody.innerHTML = "";

  // Construimos filas con datos formateados para cada producto
  const filas = await Promise.all(
    responseProductos.data.map(
      async ({
        id,
        nombre,
        tipo_producto_id,
        precio,
        stock,
        fecha_caducidad,
      }) => {
        // Obtenemos el nombre del tipo de producto para mostrarlo
        const { data: tipoProducto } = await get(
          `tipos-productos/${tipo_producto_id}`
        );

        // Devolvemos arreglo de valores para crear la fila
        return [
          id,
          nombre,
          tipoProducto.nombre,
          formatearPrecioConPuntos(precio),
          stock,
          convertirADiaMesAño(fecha_caducidad),
        ];
      }
    )
  );

  // Insertamos cada fila en la tabla y señalamos alerta si stock == 0
  filas.forEach((datosFila) => {
    const row = crearFila(datosFila);
    if (datosFila[4] === 0) {
      row.classList.add("fila-alerta");
    }
    tbody.append(row);
  });
};

/**
 * Obtiene el listado de medicamentos desde la API y los muestra en la tabla de inventario.
 *
 * @returns {Promise<void>}
 *   No retorna valor; actualiza el DOM o silencia el error si no hay registros.
 *
 */
export const listarMedicamentos = async () => {
  const responseMedicamentos = await get("medicamentos");
  if (!responseMedicamentos.success) {
    // Sin registros, simplemente salimos silenciosamente
    return;
  }

  // Seleccionamos y limpiamos la tabla de medicamentos
  const tbody = DOMSelector("#medicaments .table__body");
  tbody.innerHTML = "";

  // Construimos filas con datos formateados para cada medicamento
  const filas = await Promise.all(
    responseMedicamentos.data.map(
      async ({ id, info_medicamento_id, precio, cantidad, numero_lote }) => {
        // Obtenemos los detalles del medicamento
        const { data: info } = await get(
          `info-medicamentos/${info_medicamento_id}`
        );

        // Devolvemos arreglo de valores para crear la fila
        return [
          id,
          numero_lote,
          info.nombre,
          info.uso_general,
          capitalizarPrimeraLetra(info.via_administracion),
          capitalizarPrimeraLetra(info.presentacion),
          formatearPrecioConPuntos(precio),
          cantidad,
        ];
      }
    )
  );

  // Insertamos cada fila en la tabla y señalamos alerta si cantidad == 0
  filas.forEach((datosFila) => {
    const row = crearFila(datosFila);
    if (datosFila[7] === 0) {
      row.classList.add("fila-alerta");
    }
    tbody.append(row);
  });
};

/**
 * Controlador principal para la vista de inventario.
 * Carga productos y medicamentos, filtra acciones por permisos y maneja eventos de clic.
 *
 * @returns {void}
 *   No retorna valor; configura la UI y sus eventos.
 *
 */
export const inventoryController = () => {
  // Carga inicial de datos en ambas tablas
  listarProductos();
  listarMedicamentos();

  // Filtra botones y acciones según permisos del usuario
  const contenedorVista = DOMSelector("#inventory");
  Array.from(contenedorVista.querySelectorAll("[data-permiso]")).forEach(
    (accion) => {
      const permisos = accion.dataset.permiso.split(",");
      if (!hasPermission(permisos)) {
        accion.remove();
      }
    }
  );

  // Navegación al formulario de edición de producto
  const tablaProductos = DOMSelector("#products");
  tablaProductos.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    if (!fila || !hasPermission(["producto.update"])) return;

    const idProducto = fila.getAttribute("data-id");
    const baseHash = location.hash.endsWith("/")
      ? location.hash
      : `${location.hash}/`;
    location.hash = `${baseHash}productos/editar/id=${idProducto}`;
  });

  // Navegación al formulario de edición de medicamento
  const tablaMedicamentos = DOMSelector("#medicaments");
  tablaMedicamentos.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    if (!fila || !hasPermission(["medicamento.update"])) return;

    const idMedicamento = fila.getAttribute("data-id");
    const baseHash = location.hash.endsWith("/")
      ? location.hash
      : `${location.hash}/`;
    location.hash = `${baseHash}medicamentos/editar/id=${idMedicamento}`;
  });
};
