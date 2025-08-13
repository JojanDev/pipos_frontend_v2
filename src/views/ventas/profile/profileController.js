import {
  cargarComponente,
  cerrarModal,
  error,
  get,
  llenarSelect,
  renderizarCarrito,
  renderizarPerfilVenta,
} from "../../../helpers";
import { routes } from "../../../router/routes";

export let venta = {};
export let ventaInformacion = {};
export const profileVentaController = async (parametros = null) => {

  const { id } = parametros;
  // Supongamos que traes la venta completa desde backend
  const ventaDesdeBackend = await get(`ventas/perfil/${id}`);
  console.log(ventaDesdeBackend);

  venta = ventaDesdeBackend.data;

  if (venta.estado == "completada") {
    document.querySelector("#venta-finalizar").remove();
  }

  renderizarPerfilVenta(venta);

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
