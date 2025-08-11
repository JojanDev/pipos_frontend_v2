import { venta, ventaInformacion } from "../views";

export function renderizarCarrito() {
  const contenedor = document.querySelector(".venta-productos");

  contenedor.innerHTML = `<p class="venta-productos-placeholder">Agregue elementos</p>`;
  const placeholder = document.querySelector(".venta-productos-placeholder");

  if (venta.detalles_venta.length === 0) {
    placeholder.style.display = "initial";
    // También reseteamos el total a 0 cuando no hay productos
    document.getElementById("venta-total").textContent = "$0";
  } else {
    placeholder.style.display = "none";

    venta.detalles_venta.forEach((detalle, index) => {
      contenedor.innerHTML += crearProductoHTML(detalle, index);
    });

    // Calcular total sumando todos los subtotales
    const totalVenta = venta.detalles_venta.reduce(
      (acc, detalle) => acc + detalle.subtotal,
      0
    );

    // Actualizar el texto del span del total con formato de moneda
    document.getElementById(
      "venta-total"
    ).textContent = `$${totalVenta.toLocaleString()}`;
  }
}

export function crearProductoHTML(detalle, index) {
  // Ejemplo asumiendo que detalle puede tener id_producto, id_medicamento o id_servicio

  return `
    <div class="producto" data-index="${index}">
      <p class="producto__item producto-nombre">${detalle.nombre}</p>
      <p class="producto__item producto-cantidad">x${detalle.cantidad || 1}</p>
      <p class="producto__item producto-precio">$${detalle.subtotal}</p>
      <i class="ri-delete-bin-line delete-producto" data-index="${index}"></i>
    </div>
  `;
}
