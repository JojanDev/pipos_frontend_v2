import {
  cargarComponente,
  error,
  get,
  llenarSelect,
  renderizarCarrito,
} from "../../../helpers";
import { routes } from "../../../router/routes";

function handleEliminarClick(e) {
  const btn = e.target.closest(".delete-producto");
  if (!btn) return;

  const index = Number(btn.dataset.index);
  if (Number.isNaN(index)) return;

  venta.detalles_venta.splice(index, 1);
  renderizarCarrito();
  console.count("delete click");
}

export function initCarritoEvents() {
  const contenedor = document.querySelector(".venta-productos");
  // Opción A: flag para no volver a enlazar
  if (contenedor.dataset.bound === "true") return;
  contenedor.addEventListener("click", handleEliminarClick);
  contenedor.dataset.bound = "true";

  // Opción B (alternativa simple): evita duplicados por sobreescritura
  // contenedor.onclick = handleEliminarClick;
}

export let venta = {};
export let ventaInformacion = {};
export const createVentaController = (parametros = null) => {
  initCarritoEvents();
  venta = { detalles_venta: [] };
  ventaInformacion = { detalles_venta: [] };
  const contenedor = document.querySelector("#venta");

  // const placeholder = document.querySelector(".venta-productos-placeholder");
  // if (venta.detalles_venta.length == 0) {
  //   placeholder.style.display = "initial";
  // } else {
  //   placeholder.style.display = "none";
  // }

  //

  llenarSelect({
    endpoint: "clientes",
    selector: "#select-clientes",
    optionMapper: ({ id, info }) => ({
      id: id,
      text: `${info.numeroDocumento} - ${info.nombre}`,
    }),
  });

  contenedor.addEventListener("click", async (e) => {
    if (e.target.id == "add-product") {
      await cargarComponente(routes.ventas.agregarProducto);
    }
    const selectClientes = document.querySelector("#select-clientes");

    if (e.target.id == "venta-siguiente") {
      if (!selectClientes.value) {
        await error("Seleccione un cliente para realizar la venta");
        return;
      }
      if (venta.detalles_venta.length == 0) {
        await error("Agregue elementos para realizar la venta");
        return;
      }

      const dataJSON = localStorage.getItem("data");
      const data = JSON.parse(dataJSON);
      venta.cliente = selectClientes.options[selectClientes.selectedIndex].text;
      venta.id_cliente = selectClientes.value;
      const personal = await get("personal/" + data.id);

      venta.id_personal = data.id;
      venta.nombrePersonal = personal.data.info.nombre;

      await cargarComponente(routes.ventas.resumenVenta);
    }

    if (e.target.id == "venta-cancelar") {
      // await cargarComponente(routes.ventas.resumenVenta);
      window.location.hash = "#/ventas/";
    }

    // document
    //   .querySelector(".venta-productos")
    //   .addEventListener("click", (e) => {
    //     if (e.target.classList.contains("delete-producto")) {
    //       const index = parseInt(e.target.dataset.index);
    //       if (!isNaN(index)) {
    //         console.log(venta.detalles_venta);
    //         venta.detalles_venta.splice(index, 1);
    //         console.log(venta.detalles_venta);

    //         renderizarCarrito();
    //       }
    //     }
    //   });
  });
};
