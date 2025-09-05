import {
  get,
  crearFila,
  capitalizarPrimeraLetra,
  formatearPrecioConPuntos,
} from "../../helpers";

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

export const cargarTablaVentas = async () => {
  const ventas = await get("ventas");

  console.log(ventas);

  if (!ventas.success) {
    // await error(response.message);
    return;
  }

  const tbody = document.querySelector("#ventas .table__body");
  tbody.innerHTML = "";

  const ventasInfo = await Promise.all(
    ventas.data.map(async (venta) => {
      const { data: usuarioVenta } = await get(
        `usuarios/${venta.comprador_id}`
      );
      return [
        venta.id,
        formatoCorto(venta.fecha_creado),
        usuarioVenta.nombre,
        formatearPrecioConPuntos(venta.monto),
        formatearPrecioConPuntos(venta.total - venta.monto),
        formatearPrecioConPuntos(venta.total),
        capitalizarPrimeraLetra(venta.estado),
      ];
    })
  );

  ventasInfo.forEach((venta) => {
    const row = crearFila(venta);
    console.log(venta[venta.length - 1]);
    venta[venta.length - 1] == "Pendiente"
      ? row.classList.add("fila-naranja")
      : null;

    tbody.append(row);
  });
};

export const ventasController = async () => {
  cargarTablaVentas();

  const tablaventas = document.querySelector("#ventas");

  // const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  // console.log(acciones);


  // for (const accion of acciones) {
  //   console.log(accion.dataset.permiso.split(","));
  //   console.log(hasPermission(accion.dataset.permiso.split(",")));
  //   if (!hasPermission(accion.dataset.permiso.split(","))) {
  //     accion.remove();
  //   }
  // }

  tablaventas.addEventListener("click", async (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idVenta = fila.getAttribute("data-id");
      // await cargarComponente(routes.ventas.perfil, { id: idVenta });
      // location.hash = `#/ventas/perfil/id=${idVenta}`;
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `perfil/id=${idVenta}`
          : `/perfil/id=${idVenta}`);

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
