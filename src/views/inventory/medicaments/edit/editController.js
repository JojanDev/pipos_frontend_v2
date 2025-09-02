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
  put,
  mapearDatosEnContenedor,
  toInputDate,
  configurarBotonCerrar,
} from "../../../../helpers"; // Utilidades y funciones auxiliares

import { routes } from "../../../../router/routes"; // Rutas del sistema
import { listarMedicamentos } from "../../inventoryController";
import { validarFechaCaducidad } from "../../products/create/createController"; // Función para validar fechas de caducidad

export function validarFechaEdicion(fechaOriginal, fechaNueva) {
  // Si la fecha no cambió → no validar
  if (fechaOriginal === fechaNueva) {
    return { valid: true };
  }

  const hoy = new Date();
  const fechaIngresada = new Date(fechaNueva);

  // Fecha mínima: hoy + 7 días
  const fechaMinima = new Date();
  fechaMinima.setDate(hoy.getDate() + 7);

  if (fechaIngresada < fechaMinima) {
    return {
      valid: false,
      message: "Debe tener al menos 7 días de vigencia.",
    };
  }

  return { valid: true };
}

/**
 * Controlador para crear registros de inventario de medicamentos.
 * Maneja la carga inicial del formulario, validaciones, envío y actualización de la tabla.
 */
export const editMedicamentInventoryController = async (parametros = null) => {
  const { id } = parametros;

  const responseMedi = await get("medicamentos/" + id);
  console.log(responseMedi);

  const { data: infoMedicamento } = await get(
    `info-medicamentos/${responseMedi.data.info_medicamento_id}`
  );

  responseMedi.data.fecha_caducidad = toInputDate(
    responseMedi.data.fecha_caducidad
  );
  const form = document.querySelector("#form-register-medicament-inventory");
  mapearDatosEnContenedor({ ...responseMedi.data, infoMedicamento }, form);

  // Referencias a elementos del DOM
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#medicament-inventorys .table__body");

  // Detecta si se está usando en modal o en vista completa
  const esModal = !location.hash.includes("inventario/medicamentosEditar");

  // Configura las validaciones automáticas de los campos del formulario
  configurarEventosValidaciones(form);

  // Input para la fecha de caducidad
  const inputFecha = document.querySelector("[name='fecha_caducidad']");

  // Validar fecha al salir del input (blur)
  inputFecha.addEventListener("blur", (e) => {
    const resultado = validarFechaEdicion(
      responseMedi.data.fecha_caducidad,
      inputFecha.value
    );
    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  // Validar fecha mientras el usuario escribe (input)
  inputFecha.addEventListener("input", (e) => {
    const resultado = validarFechaEdicion(
      responseMedi.data.fecha_caducidad,
      inputFecha.value
    );
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
    const resultado = validarFechaEdicion(
      responseMedi.data.fecha_caducidad,
      inputFecha.value
    );
    if (!resultado.valid) return;

    // Envío de datos al backend
    const response = await put(`medicamentos/${id}`, {
      ...datos,
      info_medicamento_id: infoMedicamento.id,
    });

    if (!response.success) return await error(response.message); // Muestra error si la respuesta no es exitosa

    listarMedicamentos();
    // Mensaje de éxito temporal
    successTemporal(response.message);

    // Cierra modal o vuelve a vista base según el contexto
    esModal
      ? cerrarModal("create-medicament-inventory")
      : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-edit-medicament-inventory", esModal);
};
