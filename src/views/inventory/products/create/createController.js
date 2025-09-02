import {
  agregarError,
  configurarBotonCerrar,
  convertirADiaMesAño,
  DOMSelector,
  formatearPrecioConPuntos,
  get,
  llenarSelect,
  quitarError,
} from "../../../../helpers";
import {
  error,
  successTemporal,
  post,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../../helpers";

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

export const createProductController = async () => {
  const form = DOMSelector("#form-register-product");
  const tbodyProducts = DOMSelector("#products .table__body");
  const esModal = !location.hash.includes("inventario/productosCrear");

  llenarSelect({
    endpoint: "tipos-productos",
    selector: "#tipos-productos",
    optionMapper: ({ id, nombre }) => ({ id: id, text: nombre }),
  });

  configurarEventosValidaciones(form);
  const inputFecha = DOMSelector("[name='fecha_caducidad']");

  inputFecha.addEventListener("blur", (e) => {
    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  inputFecha.addEventListener("input", (e) => {
    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid);

    const response = await post("productos", datos);

    if (!response.success) return await error(response.message);

    successTemporal(response.message);

    if (tbodyProducts) {
      const { id, nombre, tipo_producto_id, precio, stock, fecha_caducidad } =
        response.data;

      const { data: tipoProducto } = await get(
        `tipos-productos/${tipo_producto_id}`
      );

      const row = crearFila([
        id,
        nombre,
        tipoProducto.nombre,
        formatearPrecioConPuntos(precio),
        stock,
        convertirADiaMesAño(fecha_caducidad),
      ]);
      tbodyProducts.insertAdjacentElement("afterbegin", row);
    }

    esModal ? cerrarModal("create-product") : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-register-product", esModal);
};
