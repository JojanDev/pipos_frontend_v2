import {
  cerrarModal,
  error,
  formatearPrecioConPuntos,
  get,
  put,
  success,
} from "../../../helpers";
import { cargarTablaVentas } from "../ventaController";

export const editVentaController = async (parametros = null) => {
  const { id } = parametros;
  const cliente = document.querySelector("#perfil-venta-cliente");
  const empleado = document.querySelector("#perfil-venta-empleado");
  const total = document.querySelector("#perfil-venta-total");
  const valorAgregar = document.querySelector("#valor-agregar");
  const botonAgregar = document.querySelector("#resume-finalizar-venta");

  const response = await get("ventas/" + id);

  if (!response.success) {
    await error(response.message);
    return;
  }

  const venta = response.data;

  cliente.textContent = venta.cliente.info.nombre;
  empleado.textContent = "Empleado: " + venta.personal.info.nombre;
  total.textContent = venta.total;

  // Setear el monto actual
  valorAgregar.value = venta.total - venta.monto;

  // Si la venta ya está completada → ocultar el botón
  if (venta.estado === "completada") {
    botonAgregar.style.display = "none";
    valorAgregar.disabled = true;
  } else {
    // Evento click para validar antes de enviar
    botonAgregar.addEventListener("click", async () => {
      const nuevoMonto = parseFloat(valorAgregar.value) || 0;
      const montoAnterior = venta.monto;

      // if (nuevoMonto < montoAnterior) {
      //   await error(
      //     `No puedes ingresar un monto menor a ${montoAnterior.toLocaleString()}`
      //   );
      //   return;
      // }
      // else
      const precioFalMax = venta.total - venta.monto;
      if (nuevoMonto > precioFalMax) {
        await error(
          `No puedes ingresar un monto mayor a ${precioFalMax.toLocaleString()}`
        );
        return;
      }

      // Aquí iría tu lógica para enviar el nuevo monto

      const responseUpdate = await put(`ventas/${id}/monto`, nuevoMonto);

      if (!responseUpdate.success) {
        await error(responseUpdate.message);
      }

      cargarTablaVentas();

      await success(responseUpdate.message);
      cerrarModal("venta-edit");
    });
  }

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-perfil-venta");
    if (arrow) {
      cerrarModal("venta-edit");
    }
  });
};
