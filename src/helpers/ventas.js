import {
  venta,
  ventaInformacion,
} from "../views/ventas/create/createController";
import { convertirADiaMesAño } from "./antecedentes";
import { capitalizarPrimeraLetra, formatearPrecioConPuntos } from "./diseño";

/**
 * Renderiza el carrito de productos en la vista de venta.
 *
 * - Si no hay productos en venta.detalles_venta, muestra placeholder y reinicia total.
 * - Si hay productos, oculta placeholder, genera HTML de cada producto y actualiza total.
 *
 * @function renderizarCarrito
 * @returns {void}
 */
export function renderizarCarrito() {
  // Contenedor donde se mostraran los productos
  const contenedor = document.querySelector(".venta-productos");

  // HTML por defecto cuando no hay elementos en el carrito
  let html = `<p class="venta-productos-placeholder">Agregue elementos</p>`;

  // Si no hay detalles de venta, mostramos placeholder y total en cero
  if (venta.detalles_venta.length === 0) {
    contenedor.innerHTML = html;
    contenedor.querySelector(".venta-productos-placeholder").style.display =
      "initial";

    // Reiniciar total de la venta a 0
    document.getElementById("venta-total").textContent = "$0";
    return;
  }

  // Hay elementos en el carrito: ocultar placeholder
  html = `<p class="venta-productos-placeholder" style="display: none;">Agregue elementos</p>`;

  // Construir el HTML de todos los productos
  venta.detalles_venta.forEach((detalle, index) => {
    html += crearProductoHTML(detalle, index);
  });

  // Reemplazar el contenido del contenedor en una sola operacion
  contenedor.innerHTML = html;

  // Calcular sumatoria de subtotales
  const totalVenta = venta.detalles_venta.reduce(
    (acc, detalle) => acc + detalle.subtotal,
    0
  );

  // Mostrar total formateado en el elemento correspondiente
  document.getElementById(
    "venta-total"
  ).textContent = `$${totalVenta.toLocaleString()}`;
}

/**
 * Genera el bloque HTML de un producto en el carrito.
 *
 * @function crearProductoHTML
 * @param {Object} detalle - Objeto con datos del producto.
 * @param {number} index   - Indice del producto en el arreglo.
 * @returns {string} Cadena HTML con la estructura del producto.
 */
export function crearProductoHTML(detalle, index) {
  // Devolver plantilla HTML con clases y data-index
  return `
    <div class="producto" data-index="${index}">
      <p class="producto__item producto-nombre">${detalle.nombre}</p>
      <p class="producto__item producto-precio">${formatearPrecioConPuntos(
        detalle.precio
      )}</p>
      <p class="producto__item producto-cantidad">x${detalle.cantidad || 1}</p>
      <p class="producto__item producto-adicional">${formatearPrecioConPuntos(
        detalle.valor_adicional
      )}</p>
      <p class="producto__item producto-subtotal">${formatearPrecioConPuntos(
        detalle.subtotal
      )}</p>
      <i class="ri-delete-bin-line delete-producto" data-index="${index}"></i>
    </div>
  `;
}

/**
 * Renderiza la seccion de perfil de una venta completa.
 *
 * - Actualiza campos de empleado, cliente, fecha de creacion, monto y estado.
 * - Limpia y muestra cada producto en el detalle de la venta.
 *
 * @function renderizarPerfilVenta
 * @param {Object} venta - Objeto de venta con informacion completa.
 * @returns {void}
 */
export function renderizarPerfilVenta(venta) {
  // Mostrar nombre del empleado
  document.getElementById("venta-profile-nombreEmpleado").textContent =
    "Empleado: " + (venta.nombreEmpleado || "");

  // Mostrar datos del cliente
  document.getElementById(
    "venta-profile-clienteDatos"
  ).textContent = `Cliente: ${venta.documentoCliente} - ${venta.nombreCliente}`;

  // Mostrar fecha de creacion en formato dia-mes-ano
  document.getElementById("venta-profile-creado").textContent =
    convertirADiaMesAño(venta.fechaCreado) || "";

  // Mostrar monto cancelado formateado o cero
  document.getElementById("venta-profile-cancelado").textContent = venta.monto
    ? formatearPrecioConPuntos(venta.monto)
    : "$0";

  // Mostrar estado segun propiedad completada
  document.getElementById("venta-profile-estado").textContent = venta.completada
    ? "Completada"
    : "Pendiente";

  // Mostrar total de la venta formateado
  document.getElementById("venta-profile-total").textContent =
    formatearPrecioConPuntos(venta.total) || "";

  // Contenedor de productos en perfil de venta
  const contenedor = document.querySelector(".venta-productos");
  // Limpiar contenido previo
  contenedor.innerHTML = "";

  // Si hay detalles, iterar y agregar cada producto
  if (venta.detalles && venta.detalles.length > 0) {
    venta.detalles.forEach((detalle, index) => {
      contenedor.innerHTML += `
        <div class="producto" data-index="${index}">
          <p class="producto__item producto-nombre">${
            detalle.producto || ""
          }</p>
          <p class="producto__item producto-categoria">${
            detalle.categoria || ""
          }</p>
          <p class="producto__item producto-precio">${
            detalle.precio ? `$${detalle.precio.toLocaleString()}` : "$0"
          }</p>
          <p class="producto__item producto-cantidad">x${
            detalle.cantidad || 1
          }</p>
          <p class="producto__item producto-adicional">${
            detalle.valorAdicional
              ? `$${detalle.valorAdicional.toLocaleString()}`
              : "$0"
          }</p>
          <p class="producto__item producto-subtotal">${
            detalle.subtotal ? `$${detalle.subtotal.toLocaleString()}` : "$0"
          }</p>
        </div>
      `;
    });
  } else {
    // Si no hay productos, mostrar placeholder
    contenedor.innerHTML = `<p class="venta-productos-placeholder">No contiene elementos</p>`;
  }
}
