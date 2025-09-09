// import { routes } from "../../../router/routes";
import {
  cargarComponente,
  error,
  get,
  llenarSelect,
  renderizarCarrito,
} from "../../../helpers";
import getCookie from "../../../helpers/getCookie.js";

export let venta = {};
export let ventaInformacion = {};

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

export const createVentaController = async (parametros = null) => {
  const { routes } = await import("../../../router/routes.js");
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

  await llenarSelect({
    endpoint: "usuarios/clientes",
    selector: "#select-clientes",
    optionMapper: ({ id, numero_documento, nombre }) => ({
      id: id,
      text: `${numero_documento} - ${nombre}`,
    }),
  });

  contenedor.addEventListener("click", async (e) => {
    if (e.target.id == "add-product") {
      // await cargarComponente(routes.ventas.agregarProducto);
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `agregar-elemento`
          : `/agregar-elemento`);
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
      venta.comprador_id = selectClientes.value;
      // const {data: vendedor} = await get("usuarios/" + data.id);
      const { usuario: vendedor } = getCookie("usuario");
      const { data: dataVendedor } = await get(`usuarios/${vendedor.id}`);

      venta.vendedor_id = 1;
      venta.nombrePersonal = dataVendedor.nombre;

      // await cargarComponente(routes.ventas.resumenVenta);
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `finalizar`
          : `/finalizar`);
    }

    if (e.target.id == "venta-cancelar") {
      // await cargarComponente(routes.ventas.resumenVenta);
      // window.location.hash = "#/ventas/";
      history.back();
    }
  });
};
