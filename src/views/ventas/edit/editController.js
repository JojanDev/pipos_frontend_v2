import {
  cerrarModal,
  configurarBotonCerrar,
  DOMSelector,
  error,
  formatearPrecioConPuntos,
  get,
  patch,
  put,
  renderizarPerfilVenta,
  success,
  successTemporal,
} from "../../../helpers";
import { cargarTablaVentas } from "../ventaController";

export const editVentaController = async (parametros = null) => {
  console.log(parametros);

  const contenedorVista = DOMSelector(`[data-modal="venta-edit"]`);
  const { id } = parametros;
  const { perfil: ventaParams } = parametros;
  const cliente = document.querySelector("#perfil-venta-cliente");
  const empleado = document.querySelector("#perfil-venta-empleado");
  const total = document.querySelector("#perfil-venta-total");
  const valorAgregar = document.querySelector("#valor-agregar");
  const botonAgregar = document.querySelector("#resume-finalizar-venta");

  const response = await get(`ventas/${ventaParams.id}`);

  if (!response.success) {
    await error(response.message);
    return;
  }

  const venta = response.data;

  const { data: clienteVenta } = await get(
    `usuarios/${response.data.comprador_id}`
  );

  const { data: vendedorVenta } = await get(
    `usuarios/${response.data.vendedor_id}`
  );

  cliente.textContent = clienteVenta.nombre;
  empleado.textContent = "Empleado: " + vendedorVenta.nombre;
  total.textContent = venta.total;

  DOMSelector("#monto-acumulado").textContent = venta.monto;
  DOMSelector("#monto-faltante").textContent = venta.total - venta.monto;

  // Setear el monto actual
  valorAgregar.value = venta.total - venta.monto;

  console.log(venta);

  // Si la venta ya está completada → ocultar el botón
  if (venta.completada) {
    botonAgregar.style.display = "none";
    valorAgregar.disabled = true;
  } else {
    // Evento click para validar antes de enviar
    botonAgregar.addEventListener("click", async () => {
      const nuevoMonto = parseFloat(valorAgregar.value) || 0;
      const montoAnterior = venta.monto;

      if (valorAgregar.value == 0) {
        await error("El monto a agregar no puede ser cero");
        return;
      }

      const precioFalMax = venta.total - venta.monto;
      if (nuevoMonto > precioFalMax) {
        await error(
          `No puedes ingresar un monto mayor a ${precioFalMax.toLocaleString()}`
        );
        return;
      }

      // Aquí iría tu lógica para enviar el nuevo monto
      console.log(response);

      // response.data.monto = nuevoMonto;
      const responseUpdate = await patch(`ventas/${ventaParams.id}/`, {
        monto: nuevoMonto,
      });
      console.log(responseUpdate);

      if (!responseUpdate.success) {
        await error(responseUpdate.message);
      }

      // cargarTablaVentas();

      // const ventaDesdeBackend = await get(`ventas/perfil/${ventaParams.id}`);

      // renderizarPerfilVenta(ventaDesdeBackend.data);

      if (responseUpdate.data.completada) {
        document.querySelector("#venta-finalizar").remove();
      }

      DOMSelector("#monto").textContent = responseUpdate.data.monto;
      DOMSelector("#completada").textContent = responseUpdate.data.completada
        ? "Completada"
        : "Pendiente";
      successTemporal(responseUpdate.message);
      cerrarModal("venta-edit");
      history.back();
    });
  }

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "back-perfil-venta") {
      cerrarModal("venta-edit");
      history.back();
    }
  });
};
