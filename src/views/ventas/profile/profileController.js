import {
  cargarComponente,
  cerrarModal,
  convertirADiaMesAño,
  DOMSelector,
  error,
  get,
  llenarSelect,
  mapearDatosEnContenedor,
  renderizarCarrito,
  renderizarPerfilVenta,
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

  if (venta.estado == "completada") {
    document.querySelector("#venta-finalizar").remove();
  }

  ventaDesdeBackend.data.fecha_creado = formatoCorto(ventaDesdeBackend.data.fecha_creado)
  const { data: vendedor } = await get(`usuarios/${ventaDesdeBackend.data.vendedor_id}`)
  const { data: comprador } = await get(`usuarios/${ventaDesdeBackend.data.comprador_id}`)
  mapearDatosEnContenedor({ ...ventaDesdeBackend.data, vendedor: "Vendedor: " + vendedor.nombre, comprador: "Cliente: " + comprador.nombre }, contenedorVenta)
  // renderizarPerfilVenta(venta);

  const contenedor = document.querySelector("#venta");

  contenedor.addEventListener("click", async (event) => {

    if (event.target.id == "venta-finalizar") {
      const idVenta = id;
      await cargarComponente(routes.ventas.editar, { id: idVenta });
    }

    if (event.target.id == "venta-cancelar") {
      window.location.hash = "#/ventas";

    }
  });

  // venta = { detalles_venta: [] };
  // ventaInformacion = { detalles_venta: [] };
  // const contenedor = document.querySelector("#venta");

  // // const placeholder = document.querySelector(".venta-productos-placeholder");
  // // if (venta.detalles_venta.length == 0) {
  // //   placeholder.style.display = "initial";
  // // } else {
  // //   placeholder.style.display = "none";
  // // }

  // //

  // llenarSelect({
  //   endpoint: "clientes",
  //   selector: "#select-clientes",
  //   optionMapper: ({ id, info }) => ({
  //     id: id,
  //     text: `${info.numeroDocumento} - ${info.nombre}`,
  //   }),
  // });

  // contenedor.addEventListener("click", async (e) => {
  //   if (e.target.id == "add-product") {
  //     await cargarComponente(routes.ventas.agregarProducto);
  //   }
  //   const selectClientes = document.querySelector("#select-clientes");

  //   if (e.target.id == "venta-siguiente") {
  //     if (!selectClientes.value) {
  //       await error("Seleccione un cliente para realizar la venta");
  //       return;
  //     }
  //     if (venta.detalles_venta.length == 0) {
  //       await error("Agregue elementos para realizar la venta");
  //       return;
  //     }

  //     const dataJSON = localStorage.getItem("data");
  //     const data = JSON.parse(dataJSON);
  //     venta.cliente = selectClientes.options[selectClientes.selectedIndex].text;
  //     venta.id_cliente = selectClientes.value;
  //     const personal = await get("personal/" + data.id);

  //     venta.id_personal = data.id;
  //     venta.nombrePersonal = personal.data.info.nombre;

  //     await cargarComponente(routes.ventas.resumenVenta);
  //   }

  //   if (e.target.id == "venta-cancelar") {
  //     // await cargarComponente(routes.ventas.resumenVenta);
  //     window.location.hash = "#/ventas/";
  //   }

  //   document
  //     .querySelector(".venta-productos")
  //     .addEventListener("click", (e) => {
  //       if (e.target.classList.contains("delete-producto")) {
  //         const index = parseInt(e.target.dataset.index);
  //         if (!isNaN(index)) {
  //           venta.detalles_venta.splice(index, 1);
  //           renderizarCarrito();
  //         }
  //       }
  //     });
  // });
};
