// Importa funciones y variables auxiliares desde módulos externos
import {
  cerrarModal, // Función para cerrar un modal
  configurarEventosValidaciones,
  DOMSelector, // Configura validaciones de formulario
  error, // Muestra mensajes de error
  post, // Hace peticiones POST al servidor
  success,
  successTemporal, // Muestra mensajes de éxito
  validarCampos, // Valida que todos los campos requeridos estén correctos
} from "../../../helpers";
import { venta } from "../create/createController"; // Objeto que contiene la información de la venta actual

// Controlador principal que gestiona la vista de resumen de la venta
export const resumeController = () => {
  const contenedor = DOMSelector("#resumen-venta");

  // Calcula el precio total sumando los subtotales de cada detalle de venta
  const precioTotal = venta.detalles_venta.reduce(
    (acc, detalle) => acc + detalle.subtotal,
    0
  );

  // Obtiene elementos del DOM donde se mostrará información
  const totalVenta = DOMSelector("#resume-total");
  const personalNombre = DOMSelector("#venta-empleado");

  // Muestra el precio total en el elemento correspondiente
  totalVenta.textContent = `$${precioTotal}`;

  const cliente = DOMSelector("#resume-cliente");

  // Muestra el nombre del cliente (separa el ID del nombre con split)
  cliente.textContent = venta.cliente.split("-")[1].slice(1);

  console.log(venta);

  // Muestra el nombre del empleado que atiende la venta
  personalNombre.textContent = "Empleado: " + venta.nombrePersonal;

  // Elementos del formulario de resumen
  const form = DOMSelector("#form-resume-venta");
  // const valorAgregado = DOMSelector("#resume-valor-agregado");
  const valorCancelado = DOMSelector("#valor_cancelado");

  // Aplica validaciones al formulario
  configurarEventosValidaciones(form);

  // Listener para botones dentro del contenedor principal
  contenedor.addEventListener("click", async (e) => {
    // Si se presiona el botón "Atrás", cerrar el modal
    if (e.target.id == "back-resume") {
      cerrarModal("venta-resume");
    }

    // Si se presiona el botón "Finalizar Venta"
    if (e.target.id == "resume-finalizar-venta") {
      // Valida que todos los campos estén correctos
      if (!validarCampos(form)) {
        return;
      }

      // Obtiene y convierte los valores de campos numéricos, si están vacíos se ponen en 0

      const valorCancValid = parseInt(valorCancelado.value)
        ? parseInt(valorCancelado.value)
        : 0;

      // Validación: monto a cancelar no puede ser cero ni mayor al total
      if (valorCancValid == 0 || valorCancValid > precioTotal) {
        await error(
          "El monto a cancelar no puede superar el total, ni ser cero"
        );
        return;
      }

      // Guarda los valores en el objeto venta
      venta.valor_cancelado = valorCancelado.value;
      // venta.valor_agregado = valorAgregado.value;

      // Limpia la propiedad 'nombre' de cada detalle para no enviarla al backend
      const detalles_venta = venta.detalles_venta.map((detalle) => {
        delete detalle.nombre;
        return detalle;
      });

      // Crea el objeto que se enviará al backend
      const objeto = {
        comprador_id: parseInt(venta.comprador_id),
        vendedor_id: venta.vendedor_id,
        total: parseFloat(precioTotal).toFixed(2), // Total formateado como string con dos decimales
        monto: parseFloat(valorCancelado.value).toFixed(2), // Monto cancelado formateado como string con dos decimales
        detalles_venta,
      };

      console.log(objeto);
      console.log({ total: parseFloat(precioTotal) });

      // Envío de datos al servidor
      const ventaResponse = await post("ventas/", {
        comprador_id: venta.comprador_id,
        vendedor_id: venta.vendedor_id,
        total: parseFloat(precioTotal), // Total formateado como string con dos decimales
        monto: parseFloat(valorCancelado.value),
      });

      console.log(ventaResponse);
      if (!ventaResponse.success) return await error(ventaResponse.message);

      await Promise.all(
        detalles_venta.map(async (elemento) => {
          if (elemento.medicamento_id) {
            const medicamentoVenta = await post(`medicamentos-ventas`, {
              ...elemento,
              venta_id: ventaResponse.data.id,
            });
            console.log(medicamentoVenta);
          } else if (elemento.producto_id) {
            const productoVenta = await post(`productos-ventas`, {
              ...elemento,
              venta_id: ventaResponse.data.id,
            });
            console.log(productoVenta);
          } else if (elemento.servicio_id) {
            const servicioVenta = await post(`servicios-ventas`, {
              ...elemento,
              venta_id: ventaResponse.data.id,
            });
            console.log(servicioVenta);
          }
        })
      );

      successTemporal(ventaResponse.message);

      window.location.hash = "#/ventas";
    }
  });
};
