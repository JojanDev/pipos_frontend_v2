import {
  agregarError,
  convertirADiaMesAño,
  formatearPrecioConPuntos,
  llenarSelect,
  quitarError,
} from "../../../../helpers";
import {
  error,
  successTemporal,
  post,
  cargarTiposDocumento,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../../helpers";

function validarFechaCaducidad(valorFecha) {
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
  const form = document.querySelector("#form-register-product");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbodyProducts = document.querySelector("#products .table__body");
  const esModal = !location.hash.includes("inventario/productosCrear");

  llenarSelect({
    endpoint: "tipos-productos",
    selector: "#tipos-productos",
    optionMapper: ({ id, nombre }) => ({ id: id, text: nombre }),
  });

  configurarEventosValidaciones(form);
  const inputFecha = document.querySelector("[name='fecha_caducidad']");

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
    console.log(datos);

    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid) return;

    const response = await post("productos", datos);
    console.log(response);

    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);

    if (tbodyProducts) {
      const { id, nombre, tipoProducto, precio, stock, fecha_caducidad } =
        response.data;

      // console.log("fila", datosFila);

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

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-client");
    if (arrow) {
      esModal ? cerrarModal("create-product") : cerrarModalYVolverAVistaBase();
    }
  });
};
