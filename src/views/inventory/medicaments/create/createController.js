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
  cargarComponente,
  llenarSelect,
  capitalizarPrimeraLetra,
  agregarError,
  quitarError,
  formatearPrecioConPuntos,
  get,
} from "../../../../helpers"; // Utilidades y funciones auxiliares

import { routes } from "../../../../router/routes"; // Rutas del sistema
import { validarFechaCaducidad } from "../../products/create/createController"; // Función para validar fechas de caducidad

/**
 * Controlador para crear registros de inventario de medicamentos.
 * Maneja la carga inicial del formulario, validaciones, envío y actualización de la tabla.
 */
export const createMedicamentInventoryController = async () => {
  // Llenar el select con la lista de medicamentos disponibles desde el backend
  llenarSelect({
    endpoint: "info-medicamentos/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id: id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

  // Referencias a elementos del DOM
  const form = document.querySelector("#form-register-medicament-inventory");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#medicament-inventorys .table__body");

  // Detecta si se está usando en modal o en vista completa
  const esModal = !location.hash.includes("inventario/medicamentosCrear");

  // Configura las validaciones automáticas de los campos del formulario
  configurarEventosValidaciones(form);

  // Input para la fecha de caducidad
  const inputFecha = document.querySelector("[name='fecha_caducidad']");

  // Validar fecha al salir del input (blur)
  inputFecha.addEventListener("blur", (e) => {
    const resultado = validarFechaCaducidad(inputFecha.value);
    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  // Validar fecha mientras el usuario escribe (input)
  inputFecha.addEventListener("input", (e) => {
    const resultado = validarFechaCaducidad(inputFecha.value);
    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  // Manejo del envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Verifica validaciones generales
    if (!validarCampos(e)) return;

    // Verifica específicamente la fecha de caducidad
    const resultado = validarFechaCaducidad(inputFecha.value);
    if (!resultado.valid) return;

    // Envío de datos al backend
    const response = await post("medicamentos", datos);

    if (!response.success) return await error(response.message); // Muestra error si la respuesta no es exitosa

    // Mensaje de éxito temporal
    successTemporal(response.message);

    // Si hay tabla visible, insertar la nueva fila en la parte superior
    const tbody = document.querySelector("#medicaments .table__body");
    if (tbody) {
      const { id, info_medicamento_id, precio, cantidad, numero_lote } =
        response.data;
      const { data: info } = await get(
        `info-medicamentos/${info_medicamento_id}`
      );
      const filaNueva = [
        id,
        numero_lote,
        info.nombre,
        info.uso_general,
        capitalizarPrimeraLetra(info.via_administracion),
        capitalizarPrimeraLetra(info.presentacion),
        formatearPrecioConPuntos(precio), // Formatea precio con puntos
        cantidad,
      ];
      const row = crearFila(filaNueva);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    // Cierra modal o vuelve a vista base según el contexto
    esModal
      ? cerrarModal("create-medicament-inventory")
      : cerrarModalYVolverAVistaBase();
  });

  // Escucha eventos de click generales en el documento
  document.addEventListener("click", async (event) => {
    // Botón de retroceso
    const arrow = event.target.closest("#back-register-medicament-inventory");
    if (arrow) {
      esModal
        ? cerrarModal("create-medicament-inventory")
        : cerrarModalYVolverAVistaBase();
    }

    // Botón para registrar información de medicamento adicional
    if (event.target.id == "register-medicament-info") {
      await cargarComponente(routes.medicamentos_info.crear);
    }
  });
};
