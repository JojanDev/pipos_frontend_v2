import {
  get,
  cargarTiposDocumento,
  crearFila,
  convertirADiaMesAño,
  capitalizarPrimeraLetra,
  cargarComponente,
} from "../../helpers";
import { routes } from "../../router/routes";

function formatoCorto(localDateTime) {
  const fecha = new Date(localDateTime);

  const opciones = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  // Formato corto en español
  return new Intl.DateTimeFormat("es-ES", opciones).format(fecha);
}

// Ejemplo
console.log(formatoCorto("2025-08-09T15:45:00"));
// 👉 "09/08/2025 15:45"

export const cargarTablaVentas = async () => {
  const ventas = await get("ventas");

  console.log(ventas);

  if (!ventas.success) {
    // await error(response.message);
    return;
  }

  const tbody = document.querySelector("#ventas .table__body");
  tbody.innerHTML = "";

  const ventasInfo = ventas.data.map((venta) => {
    // console.log("cliente", cliente);

    // const info = venta.info;
    // console.log("info", info);

    return [
      venta.id,
      formatoCorto(venta.fecha),
      venta.cliente.info.nombre,
      venta.monto,
      venta.total,
      capitalizarPrimeraLetra(venta.estado),
    ];
  });
  console.log(ventasInfo);

  ventasInfo.forEach((cliente) => {
    const row = crearFila(cliente);
    tbody.append(row);
  });
};

export const ventasController = async () => {
  cargarTablaVentas();

  const tablaventas = document.querySelector("#ventas");

  tablaventas.addEventListener("click", async (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idVenta = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", idVenta);
      await cargarComponente(routes.ventas.editar, { id: idVenta });
      // location.hash = `#/ventas/perfil/id=${idCliente}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
