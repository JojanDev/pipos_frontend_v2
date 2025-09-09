import {
  agregarError,
  configurarBotonCerrar,
  convertirADiaMesAño,
  crearFila,
  DOMSelector,
  formatearPrecioConPuntos,
  get,
  llenarSelect,
  mapearDatosEnContenedor,
  put,
  quitarError,
  toInputDate,
} from "../../../../helpers";
import {
  error,
  successTemporal,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../../helpers";
import { listarProductos } from "../../inventoryController";
import { validarFechaEdicion } from "../../medicaments/edit/editController";

export function validarFechaCaducidad(valorFecha) {
  if (!valorFecha) {
    return { valid: false, message: "La fecha es obligatoria" };
  }

  const hoy = new Date();
  const fechaMinima = new Date();
  fechaMinima.setMonth(hoy.getMonth() + 1); // mínimo un mes de caducidad

  const fechaIngresada = new Date(valorFecha);

  if (fechaIngresada < fechaMinima) {
    return {
      valid: false,
      message: "La fecha debe tener al menos un mes desde hoy",
    };
  }

  return { valid: true };
}

export const editProductController = async (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="edit-product"]`);
  // const { id } = parametros;
  const { editar: producto } = parametros;

  const responseProducto = await get(`productos/${producto.id}`);
  console.log(responseProducto);

  const form = DOMSelector("#form-register-product");
  const tbodyProducts = DOMSelector("#products .table__body");
  const esModal = !location.hash.includes("inventario/productosCrear");

  await llenarSelect({
    endpoint: "tipos-productos",
    selector: "#tipos-productos",
    optionMapper: ({ id, nombre }) => ({ id: id, text: nombre }),
  });

  responseProducto.data.fecha_caducidad = toInputDate(
    responseProducto.data.fecha_caducidad
  );
  responseProducto.data["tipos-productos"] =
    responseProducto.data.tipo_producto_id;
  mapearDatosEnContenedor(responseProducto.data, form);

  configurarEventosValidaciones(form);
  const inputFecha = DOMSelector("[name='fecha_caducidad']");

  inputFecha.addEventListener("blur", (e) => {
    const resultado = validarFechaEdicion(
      responseProducto.data.fecha_caducidad,
      inputFecha.value
    );

    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  inputFecha.addEventListener("input", (e) => {
    const resultado = validarFechaEdicion(
      responseProducto.data.fecha_caducidad,
      inputFecha.value
    );

    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const resultado = validarFechaEdicion(
      responseProducto.data.fecha_caducidad,
      inputFecha.value
    );

    if (!resultado.valid) return;

    const response = await put(`productos/${producto.id}`, datos);

    if (!response.success) return await error(response.message);

    console.log(response);

    successTemporal(response.message);
    {
      const { id, nombre, tipo_producto_id, precio, stock, fecha_caducidad } =
        response.data;
      const { data: tipoProducto } = await get(
        `tipos-productos/${tipo_producto_id}`
      );
      const updatedRow = crearFila([
        id,
        nombre,
        tipoProducto.nombre,
        formatearPrecioConPuntos(precio),
        stock,
        convertirADiaMesAño(fecha_caducidad),
      ]);

      if (stock == 0) {
        updatedRow.classList.add("fila-alerta");
      }

      const oldRow = tbodyProducts.querySelector(`[data-id='${id}']`);

      tbodyProducts.replaceChild(updatedRow, oldRow);
    }

    cerrarModal("edit-product");
    history.back();
  });

  // configurarBotonCerrar("back-edit-product", esModal);
  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "back-edit-product") {
      cerrarModal("edit-product");
      history.back();
    }
  });
};
