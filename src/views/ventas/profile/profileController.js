import {
  cargarComponente,
  DOMSelector,
  get,
  mapearDatosEnContenedor,
} from "../../../helpers";
import { routes } from "../../../router/routes";

function formatoCorto(fechaIsoUtc) {
  if (!fechaIsoUtc) return "Fecha inválida";

  const fecha = new Date(fechaIsoUtc);
  if (isNaN(fecha)) return "Fecha inválida";

  const opciones = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  // Devuelve algo como "02/09/2025 11:18"
  return new Intl.DateTimeFormat("es-ES", opciones).format(fecha);
}

export let venta = {};
export let ventaInformacion = {};
export const profileVentaController = async (parametros = null) => {
  const { id } = parametros;
  // Supongamos que traes la venta completa desde backend
  const ventaDesdeBackend = await get(`ventas/${id}`);
  console.log(ventaDesdeBackend);
  const contenedorVenta = DOMSelector("#venta");

  venta = ventaDesdeBackend.data;

  if (venta.estado == "completada") DOMSelector("#venta-finalizar").remove();

  ventaDesdeBackend.data.fecha_creado = formatoCorto(
    ventaDesdeBackend.data.fecha_creado
  );
  const { data: vendedor } = await get(
    `usuarios/${ventaDesdeBackend.data.vendedor_id}`
  );
  const { data: comprador } = await get(
    `usuarios/${ventaDesdeBackend.data.comprador_id}`
  );

  mapearDatosEnContenedor(
    {
      ...ventaDesdeBackend.data,
      vendedor: "Vendedor: " + vendedor.nombre,
      comprador: "Cliente: " + comprador.nombre,
    },
    contenedorVenta
  );
  // renderizarPerfilVenta(venta);

  // Contenedor de productos

  let datosProductos = [];
  let datosMedicamentos = [];
  let datosServicios = [];
  const productosVenta = await get(`productos-ventas/venta/${id}`);
  console.log(productosVenta);

  if (productosVenta.success) {
    datosProductos = await Promise.all(
      productosVenta.data.map(async (productoVenta) => {
        const { data: producto } = await get(
          `productos/${productoVenta.producto_id}`
        );

        const { data: tipoProducto } = await get(
          `tipos-productos/${producto.tipo_producto_id}`
        );

        return {
          elemento: producto.nombre,
          categoria: tipoProducto.nombre,
          ...productoVenta,
        };
      })
    );
  }

  const medicamentosVenta = await get(`medicamentos-ventas/venta/${id}`);

  if (medicamentosVenta.success) {
    datosMedicamentos = await Promise.all(
      medicamentosVenta.data.map(async (medicamentoVenta) => {
        const { data: medicamento } = await get(
          `medicamentos/${medicamentoVenta.medicamento_id}`
        );

        const { data: infoMedicamento } = await get(
          `info-medicamentos/${medicamento.info_medicamento_id}`
        );

        return {
          elemento: infoMedicamento.nombre,
          categoria: "Medicamento",
          ...medicamentoVenta,
        };
      })
    );
  }

  const serviciosVenta = await get(`servicios-ventas/venta/${id}`);

  console.log(serviciosVenta);

  if (serviciosVenta.success) {
    datosServicios = await Promise.all(
      serviciosVenta.data.map(async (servicioVenta) => {
        const { data: servicio } = await get(
          `servicios/${servicioVenta.servicio_id}`
        );

        return {
          elemento: servicio.nombre,
          categoria: "Servicio",
          ...servicioVenta,
        };
      })
    );
  }

  const elementosVentas = [
    ...datosMedicamentos,
    ...datosProductos,
    ...datosServicios,
  ];

  console.log(elementosVentas);

  const contenedorVentaProducto = document.querySelector(".venta-productos");
  contenedorVentaProducto.innerHTML = ""; // Limpiamos primero
  elementosVentas.forEach((elementoVenta) => {
    contenedorVentaProducto.innerHTML += `
        <div class="producto"">
          <p class="producto__item producto-nombre">${
            elementoVenta.elemento || ""
          }</p>
          <p class="producto__item producto-categoria">${
            elementoVenta.categoria
          }</p>
          <p class="producto__item producto-precio">${
            elementoVenta.precio
              ? `$${elementoVenta.precio.toLocaleString()}`
              : "$0"
          }</p>
          <p class="producto__item producto-cantidad">x${
            elementoVenta.cantidad || 1
          }</p>
          <p class="producto__item producto-adicional">${
            elementoVenta.valor_adicional
              ? `$${elementoVenta.valor_adicional.toLocaleString()}`
              : "$0"
          }</p>
          <p class="producto__item producto-subtotal">${
            elementoVenta.subtotal
              ? `$${elementoVenta.subtotal.toLocaleString()}`
              : "$0"
          }</p>
        </div>
      `;
  });

  const contenedor = DOMSelector("#venta");

  contenedor.addEventListener("click", async (event) => {
    if (event.target.id == "venta-finalizar") {
      const idVenta = id;
      await cargarComponente(routes.ventas.editar, { id: idVenta });
    }

    if (event.target.id == "venta-cancelar") {
      window.location.hash = "#/ventas";
    }
  });
};
