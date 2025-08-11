import {
  cerrarModal,
  configurarEventosValidaciones,
  datos,
  error,
  get,
  llenarSelect,
  renderizarCarrito,
  success,
  validarCampos,
} from "../../../../helpers";
import { venta, ventaInformacion } from "../../create/createController";

export const createDetailsController = () => {
  const contenedor = document.querySelector("#venta-details");
  const selectTipo = document.querySelector("#tipo-producto");
  const selectElementos = document.querySelector("#select-elementos");
  const inputCantidad = document.querySelector("#cantidad");
  const inputPrecio = document.querySelector("#precio");
  const form = document.querySelector("#form-venta-details");
  let precioElementos = 0;
  let cantidadElemento = 0;

  contenedor.addEventListener("click", (e) => {
    if (e.target.id == "back-venta-details") {
      console.log(e.target);

      cerrarModal("venta-details");
    }
  });

  configurarEventosValidaciones(form);

  selectTipo.addEventListener("change", () => {
    selectElementos.innerHTML =
      '<option disabled selected value="">Seleccione un elemento</option>';
    console.log(selectTipo.value);
    inputCantidad.disabled = false;
    inputCantidad.placeholder = "";
    inputPrecio.disabled = true;
    inputCantidad.value = "";
    inputPrecio.value = "";
    inputPrecio.placeholder = "";

    if (selectTipo.value == "medicamento") {
      llenarSelect({
        endpoint: "medicamentos",
        selector: "#select-elementos",
        optionMapper: (elemento) => ({
          id: elemento.id,
          text: `${elemento.numero_lote} - ${elemento.info.nombre}`,
        }),
      });
      inputPrecio.placeholder = "Seleccione un elemento";
    } else if (selectTipo.value == "producto") {
      llenarSelect({
        endpoint: "productos",
        selector: "#select-elementos",
        optionMapper: (elemento) => ({
          id: elemento.id,
          text: `${elemento.tipoProducto.nombre} - ${elemento.nombre}`,
        }),
      });
      inputPrecio.placeholder = "Seleccione un elemento";
    } else if (selectTipo.value == "servicio") {
      llenarSelect({
        endpoint: "servicios",
        selector: "#select-elementos",
        optionMapper: (elemento) => ({
          id: elemento.id,
          text: `${elemento.nombre}`,
        }),
      });
      inputPrecio.disabled = false;
      inputCantidad.disabled = true;
      inputCantidad.placeholder = "No disponible";
      inputCantidad.value = "";
    }
  });

  selectElementos.addEventListener("change", async () => {
    // inputCantidad.value = inputCantidad.value == "" ? 1;
    if (selectTipo.value == "medicamento") {
      const medicamento = await get("medicamentos/" + selectElementos.value);

      if (!medicamento.success) return;

      precioElementos = medicamento.data.precio;
      inputPrecio.value = medicamento.data.precio;
      cantidadElemento = medicamento.data.cantidad;

      if (inputCantidad.value == "") inputCantidad.value = 1;
    } else if (selectTipo.value == "producto") {
      const productos = await get("productos/" + selectElementos.value);

      if (!productos.success) return;

      inputPrecio.value = productos.data.precio;
      precioElementos = productos.data.precio;
      cantidadElemento = productos.data.stock;

      if (inputCantidad.value == "") inputCantidad.value = 1;
    } else if (selectTipo.value == "servicio") {
    }
  });

  // inputCantidad.addEventListener("change", () => {
  //   if (selectTipo.value == "servicio") return;

  //   inputPrecio.value = precioElementos * inputCantidad.value;
  // });

  inputCantidad.addEventListener("input", () => {
    if (selectTipo.value == "servicio") return;

    inputPrecio.value = precioElementos * inputCantidad.value;
    if (inputPrecio.value == 0) inputPrecio.value = precioElementos;

    // if (inputCantidad.value == 0) inputCantidad.value = 1;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    if (
      inputCantidad.value == 0 &&
      (selectTipo.value == "medicamento" || selectTipo.value == "producto")
    ) {
      error("Ingrese un valor valido en cantidad");
      return;
    }

    const { tipo_elemento, elemento, precio, cantidad } = datos;

    // Buscar si ya existe en el carrito
    let existente = venta.detalles_venta.find((det) => {
      if (tipo_elemento === "medicamento")
        return det.id_medicamento === elemento;
      if (tipo_elemento === "producto") return det.id_producto === elemento;
      if (tipo_elemento === "servicio") return det.id_servicio === elemento;
      return false;
    });

    // Validar stock considerando lo ya agregado
    if (
      (tipo_elemento === "medicamento" || tipo_elemento === "producto") &&
      existente
    ) {
      const cantidadYaAgregada = existente.cantidad;
      const stockRestante = cantidadElemento - cantidadYaAgregada;
      const totalSolicitado = cantidadYaAgregada + cantidad;

      if (totalSolicitado > cantidadElemento) {
        error(
          `Está excediendo la cantidad máxima del elemento (${stockRestante})`
        );
        return;
      }
    } else if (
      (tipo_elemento === "medicamento" || tipo_elemento === "producto") &&
      cantidad > cantidadElemento
    ) {
      error(
        `Está excediendo la cantidad máxima del elemento (${cantidadElemento})`
      );
      return;
    }

    if (existente) {
      // Actualizar cantidad y subtotal
      if (tipo_elemento !== "servicio") {
        existente.cantidad += cantidad;
        existente.subtotal = existente.cantidad * precioElementos;
      } else {
        existente.subtotal += precio; // o simplemente precio si es único
      }
    } else {
      const objeto = { precio: precioElementos };
      if (tipo_elemento === "medicamento") {
        objeto.id_medicamento = elemento;
        objeto.cantidad = cantidad;
        objeto.subtotal = cantidad * precioElementos;
      } else if (tipo_elemento === "producto") {
        objeto.id_producto = elemento;
        objeto.cantidad = cantidad;
        objeto.subtotal = cantidad * precioElementos;
      } else if (tipo_elemento === "servicio") {
        objeto.id_servicio = elemento;
        objeto.subtotal = precio;
      }
      venta.detalles_venta.push(objeto);
      const nombreSeleccionado =
        selectElementos.options[selectElementos.selectedIndex].text;
      objeto.nombre = nombreSeleccionado;
      //   const copy = objeto;
      // ventaInformacion.detalles_venta.push(copy);

      console.log(venta);
    }

    // console.log(venta);
    renderizarCarrito();

    await success("Elemento agregado!");
    cerrarModal("venta-details");
  });
};
