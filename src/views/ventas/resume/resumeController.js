import {
  cerrarModal,
  configurarEventosValidaciones,
  error,
  post,
  success,
  validarCampos,
} from "../../../helpers";
import { venta } from "../create/createController";

export const resumeController = () => {
  const contenedor = document.querySelector("#resumen-venta");

  const precioTotal = venta.detalles_venta.reduce(
    (acc, detalle) => acc + detalle.subtotal,
    0
  );
  const totalVenta = document.querySelector("#resume-total");
  const personalNombre = document.querySelector("#venta-empleado");
  console.log(totalVenta);

  totalVenta.textContent = `$${precioTotal}`;

  const cliente = document.querySelector("#resume-cliente");

  cliente.textContent = venta.cliente.split("-")[1].slice(1);
  personalNombre.textContent = "Empleado: " + venta.nombrePersonal;
  const form = document.querySelector("#form-resume-venta");
  const valorAgregado = document.querySelector("#resume-valor-agregado");
  const valorCancelado = document.querySelector("#valor_cancelado");

  configurarEventosValidaciones(form);

  contenedor.addEventListener("click", async (e) => {
    if (e.target.id == "back-resume") {
      cerrarModal("venta-resume");
    }
    if (e.target.id == "resume-finalizar-venta") {
      if (!validarCampos(form)) {
        return;
      }
      console.log(precioTotal + parseInt(valorAgregado.value));
      const valorAgregadoo = parseInt(valorAgregado.value)
        ? parseInt(valorAgregado.value)
        : 0;

      if (valorCancelado.value > precioTotal + valorAgregadoo) {
        await error("El monto a cancelar no puede superar el total");
      }

      venta.valor_cancelado = valorCancelado.value;
      venta.valor_agregado = valorAgregado.value;
      console.log(venta.detalles_venta);

      const detalles_venta = venta.detalles_venta.map((detalle) => {
        delete detalle.nombre;
        return detalle;
      });

      console.log(detalles_venta);

      const objeto = {
        id_cliente: parseInt(venta.id_cliente),
        id_personal: venta.id_personal,
        total: (precioTotal + valorAgregadoo).toFixed(2), // string "100.00"
        monto: parseFloat(valorCancelado.value).toFixed(2), // string "100.00"
        detalles_venta,
      };

      console.log(objeto);

      const response = await post("ventas/detalles", objeto);

      console.log(response);
      if (!response.success) {
        await error(response.message);
        return;
      }

      await success(response.message);

      window.location.hash = "#/ventas";

      // cerrarModal("venta-resume");
    }
  });

  valorAgregado.addEventListener("input", () => {
    const valor =
      parseInt(valorAgregado.value) > 0 ? parseInt(valorAgregado.value) : 0;
    totalVenta.textContent = precioTotal + valor;
    // console.log(parseInt(valorAgregado.value));
  });
};
