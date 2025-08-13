import { venta, ventaInformacion } from "../views/ventas/create/createController";
import { convertirADiaMesAño } from "./antecedentes";
import { formatearPrecioConPuntos } from "./diseño";

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
      <p class="producto__item producto-precio">${formatearPrecioConPuntos(detalle.precio)}</p>
      <p class="producto__item producto-cantidad">x${detalle.cantidad || 1}</p>
      <p class="producto__item producto-adicional">${formatearPrecioConPuntos(detalle.valor_adicional)}</p>
      <p class="producto__item producto-subtotal">${formatearPrecioConPuntos(detalle.subtotal)}</p>
      <i class="ri-delete-bin-line delete-producto" data-index="${index}"></i>
    </div>
  `;
}


export function renderizarPerfilVenta(venta) {
  // Nombre del empleado
  document.getElementById("venta-profile-nombreEmpleado").textContent = "Empleado: " + venta.nombreEmpleado || "";

  // Datos del cliente
  document.getElementById("venta-profile-clienteDatos").textContent =
    `Cliente: ${venta.documentoCliente} - ${venta.nombreCliente}`;

  // Fecha de creación
  document.getElementById("venta-profile-creado").textContent =
    convertirADiaMesAño(venta.fechaCreado) || "";

  // Monto cancelado
  document.getElementById("venta-profile-cancelado").textContent =
    venta.monto ? formatearPrecioConPuntos(venta.monto) : "$0";

  // Estado
  document.getElementById("venta-profile-estado").textContent =
    venta.estado || "";
  
  document.getElementById("venta-profile-total").textContent =
    formatearPrecioConPuntos(venta.total) || "";

  // Contenedor de productos
  const contenedor = document.querySelector(".venta-productos");
  contenedor.innerHTML = ""; // Limpiamos primero

  if (venta.detalles && venta.detalles.length > 0) {
    venta.detalles.forEach((detalle, index) => {
      contenedor.innerHTML += `
        <div class="producto" data-index="${index}">
          <p class="producto__item producto-nombre">${detalle.producto || ""}</p>
          <p class="producto__item producto-precio">${detalle.precio ? `$${detalle.precio.toLocaleString()}` : "$0"}</p>
          <p class="producto__item producto-cantidad">x${detalle.cantidad || 1}</p>
          <p class="producto__item producto-adicional">${detalle.valorAdicional ? `$${detalle.valorAdicional.toLocaleString()}` : "$0"}</p>
          <p class="producto__item producto-subtotal">${detalle.subtotal ? `$${detalle.subtotal.toLocaleString()}` : "$0"}</p>
        </div>
      `;
    });

    // Actualizar total de la venta
    // const totalVenta = venta.detalles_venta.reduce((acc, d) => acc + (d.subtotal || 0), 0);
    // document.getElementById("venta-total").textContent = `$${totalVenta.toLocaleString()}`;
  } else {
    contenedor.innerHTML = `<p class="venta-productos-placeholder">No contiene elementos</p>`;
    // document.getElementById("venta-total").textContent = "$0";
  }
}
