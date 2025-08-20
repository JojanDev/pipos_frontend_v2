import {
  agregarError,
  convertirADiaMesAño,
  formatearPrecioConPuntos,
  get,
  llenarSelect,
  put,
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
  const { id } = parametros;

  const responseProducto = await get("productos/" + id);
  console.log(responseProducto);

  document.querySelector("#nombre").value = responseProducto.data.nombre;
  document.querySelector("#fecha_caducidad").value =
    responseProducto.data.fecha_caducidad;
  document.querySelector("#precio").value = responseProducto.data.precio;
  document.querySelector("#stock").value = responseProducto.data.stock;
  document.querySelector("#descripcion").value =
    responseProducto.data.descripcion || "";

  const form = document.querySelector("#form-register-product");
  const tbodyProducts = document.querySelector("#products .table__body");
  const esModal = !location.hash.includes("inventario/productosCrear");

  await llenarSelect({
    endpoint: "tipos-productos",
    selector: "#tipos-productos",
    optionMapper: ({ id, nombre }) => ({ id: id, text: nombre }),
  });

  document.querySelector("#tipos-productos").value =
    responseProducto.data.tipoProducto.id;

  configurarEventosValidaciones(form);
  const inputFecha = document.querySelector("[name='fecha_caducidad']");

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

    const response = await put("productos/" + id, datos);

    if (!response.success) {
      await error(response.message);
      return;
    }

    console.log(response);

    listarProductos();
    await successTemporal(response.message);

    // if (tbodyProducts) {
    //   const { id, nombre, tipoProducto, precio, stock, fecha_caducidad } =
    //     response.data;

    //   //

    //   const row = crearFila([
    //     id,
    //     nombre,
    //     tipoProducto.nombre,
    //     formatearPrecioConPuntos(precio),
    //     stock,
    //     convertirADiaMesAño(fecha_caducidad),
    //   ]);
    //   tbodyProducts.insertAdjacentElement("afterbegin", row);
    // }

    esModal ? cerrarModal("edit-product") : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-edit-product");
    if (arrow) {
      esModal ? cerrarModal("edit-product") : cerrarModalYVolverAVistaBase();
    }
  });
};
