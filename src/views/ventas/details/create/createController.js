import {
  cerrarModal,
  configurarEventosValidaciones,
  datos,
  error,
  get,
  llenarSelect,
  llenarSelectMedicamentos,
  llenarSelectProductos,
  renderizarCarrito,
  success,
  successTemporal,
  validarCampos,
} from "../../../../helpers";
import { venta, ventaInformacion } from "../../create/createController";

/**
 * Controlador principal para manejar los detalles de venta
 * Gestiona la adición de productos, servicios y medicamentos al carrito de venta
 */
export const createDetailsController = () => {
  // Obtención de elementos DOM necesarios
  const contenedor = document.querySelector("#venta-details");
  const selectTipo = document.querySelector("#tipo-producto");
  const selectElementos = document.querySelector("#select-elementos");
  const inputCantidad = document.querySelector("#cantidad");
  const inputPrecio = document.querySelector("#precio");
  const form = document.querySelector("#form-venta-details");

  // Variables globales para almacenar precio y cantidad disponible del elemento seleccionado
  let precioElementos = 0;
  let cantidadElemento = 0;

  /**
   * Event listener para cerrar el modal cuando se hace clic en el botón "back"
   */
  contenedor.addEventListener("click", (e) => {
    if (e.target.id == "back-venta-details") {
      cerrarModal("venta-details");
      history.back();
    }
  });

  // Configurar validaciones automáticas en el formulario
  configurarEventosValidaciones(form);

  /**
   * Event listener para el cambio de tipo de elemento (producto/servicio/medicamento)
   * Limpia y reconfigura los campos según el tipo seleccionado
   */
  selectTipo.addEventListener("change", async () => {
    // Resetear el select de elementos con opción por defecto
    selectElementos.innerHTML =
      '<option disabled selected value="">Seleccione un elemento</option>';

    // Habilitar cantidad y deshabilitar precio (se calculará automáticamente)
    inputCantidad.disabled = false;
    inputCantidad.placeholder = "";
    inputPrecio.disabled = true;
    inputCantidad.value = "";
    inputPrecio.value = "";

    // Llenar el select según el tipo seleccionado
    if (selectTipo.value == "medicamento") {
      // Para medicamentos: mostrar número de lote y nombre
      await llenarSelectMedicamentos();
      inputPrecio.placeholder = "Seleccione un elemento";
    } else if (selectTipo.value == "producto") {
      // Para productos: mostrar tipo de producto y nombre
      await llenarSelectProductos();
      inputPrecio.placeholder = "Seleccione un elemento";
    } else if (selectTipo.value == "servicio") {
      // Para servicios: mostrar solo el nombre
      llenarSelect({
        endpoint: "servicios",
        selector: "#select-elementos",
        optionMapper: (elemento) => ({
          id: elemento.id,
          text: `${elemento.nombre}`,
        }),
      });
      inputPrecio.placeholder = "Seleccione un elemento";
    }
  });

  /**
   * Event listener para cuando se selecciona un elemento específico
   * Obtiene los datos del elemento y actualiza precio y cantidad disponible
   */
  selectElementos.addEventListener("change", async () => {
    if (selectTipo.value == "medicamento") {
      // Obtener datos del medicamento seleccionado
      const medicamento = await get("medicamentos/" + selectElementos.value);

      if (!medicamento.success) return;

      // Establecer precio y cantidad disponible
      precioElementos = medicamento.data.precio;
      inputPrecio.value = medicamento.data.precio;
      cantidadElemento = medicamento.data.cantidad;

      // Establecer cantidad por defecto si está vacía
      if (inputCantidad.value == "") inputCantidad.value = 1;
    } else if (selectTipo.value == "producto") {
      // Obtener datos del producto seleccionado
      const productos = await get("productos/" + selectElementos.value);

      if (!productos.success) return;

      // Establecer precio y stock disponible
      inputPrecio.value = productos.data.precio;
      precioElementos = productos.data.precio;
      cantidadElemento = productos.data.stock;

      if (inputCantidad.value == "") inputCantidad.value = 1;
    } else if (selectTipo.value == "servicio") {
      // Obtener datos del servicio seleccionado
      const servicio = await get("servicios/" + selectElementos.value);

      if (!servicio.success) return;

      // Para servicios, la cantidad es ilimitada (Number.MAX_VALUE)
      inputPrecio.value = servicio.data.precio;
      precioElementos = servicio.data.precio;
      cantidadElemento = Number.MAX_VALUE;

      if (inputCantidad.value == "") inputCantidad.value = 1;
    }
  });

  /**
   * Event listener para actualizar el precio total cuando cambia la cantidad
   * Calcula automáticamente: precio_unitario * cantidad
   */
  inputCantidad.addEventListener("input", () => {
    inputPrecio.value = precioElementos * inputCantidad.value;
    // Si el resultado es 0, mantener el precio original
    if (inputPrecio.value == 0) inputPrecio.value = precioElementos;
  });

  /**
   * Event listener para el envío del formulario
   * Valida datos, verifica stock y agrega el elemento al carrito de venta
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar campos del formulario
    if (!validarCampos(e)) return;

    // Validar que la cantidad sea mayor a 0
    if (inputCantidad.value == 0) {
      error("Ingrese un valor valido en cantidad");
      return;
    }

    // Extraer datos del formulario
    let { tipo_elemento, elemento, precio, cantidad, valor_adicional } = datos;
    valor_adicional = valor_adicional == "" ? 0 : valor_adicional;
    /**
     * Verificar si el elemento ya existe en el carrito
     * Busca por ID según el tipo de elemento
     */
    let existente = venta.detalles_venta.find((det) => {
      if (tipo_elemento === "medicamento")
        return det.id_medicamento === elemento;
      if (tipo_elemento === "producto") return det.id_producto === elemento;
      if (tipo_elemento === "servicio") return det.id_servicio === elemento;
      return false;
    });

    /**
     * Validación de stock considerando elementos ya agregados al carrito
     */
    if (existente) {
      // Si ya existe, verificar que no se exceda el stock total
      const cantidadYaAgregada = existente.cantidad;
      const stockRestante = cantidadElemento - cantidadYaAgregada;
      const totalSolicitado = cantidadYaAgregada + cantidad;

      if (totalSolicitado > cantidadElemento) {
        error(
          `Está excediendo la cantidad máxima del elemento (${stockRestante})`
        );
        return;
      }
    } else if (cantidad > cantidadElemento) {
      // Si es nuevo elemento, verificar que no exceda el stock disponible
      error(
        `Está excediendo la cantidad máxima del elemento (${cantidadElemento})`
      );
      return;
    }

    /**
     * Actualizar o agregar elemento al carrito
     */
    if (existente) {
      // Si ya existe, actualizar cantidad y subtotal
      if (tipo_elemento) {
        existente.cantidad += cantidad;
        existente.valor_adicional += valor_adicional;
        // Recalcular subtotal: (cantidad * precio_unitario) + valor_adicional
        existente.subtotal =
          existente.cantidad * precioElementos + existente.valor_adicional;
      }
    } else {
      // Si no existe, crear nuevo objeto para el carrito
      const objeto = { precio: precioElementos };

      if (tipo_elemento === "medicamento") objeto.medicamento_id = elemento;
      else if (tipo_elemento === "producto") objeto.producto_id = elemento;
      else if (tipo_elemento === "servicio") objeto.servicio_id = elemento;

      objeto.cantidad = cantidad;
      objeto.subtotal = cantidad * precioElementos + valor_adicional;
      objeto.valor_adicional = valor_adicional;

      // Agregar al carrito y obtener nombre para mostrar
      venta.detalles_venta.push(objeto);
      const nombreSeleccionado =
        selectElementos.options[selectElementos.selectedIndex].text;
      objeto.nombre = nombreSeleccionado;

      console.log(venta);
    }

    // Actualizar la visualización del carrito
    renderizarCarrito();

    // Mostrar mensaje de éxito y cerrar modal
    successTemporal("Elemento agregado!");
    cerrarModal("venta-details");
    history.back();
  });
};
