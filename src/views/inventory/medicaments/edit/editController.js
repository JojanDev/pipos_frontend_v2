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
  const fecha = document.querySelector("#fecha");
  const lote = document.querySelector("#lote");
  const precio = document.querySelector("#precio");
  const cantidad = document.querySelector("#cantidad");

  fecha.value = responseMedi.data.fecha_caducidad;
  lote.value = responseMedi.data.numero_lote;
  precio.value = responseMedi.data.precio;
  cantidad.value = responseMedi.data.cantidad;

  // Referencias a elementos del DOM
  const form = document.querySelector("#form-register-medicament-inventory");
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

    datos["id_medicamento_info"] = responseMedi.data.info.id;
    // Envío de datos al backend
    const response = await put("medicamentos/" + id, datos);

    if (!response.success) {
      await error(response.message); // Muestra error si la respuesta no es exitosa
      return;
    }

    listarMedicamentos();
    // Mensaje de éxito temporal
    await successTemporal(response.message);

    // Si hay tabla visible, insertar la nueva fila en la parte superior
    // const tbody = document.querySelector("#medicaments .table__body");
    // if (tbody) {
    //   const { id, info, precio, cantidad, numero_lote } = response.data;
    //   const filaNueva = [
    //     id,
    //     numero_lote,
    //     info.nombre,
    //     info.uso_general,
    //     capitalizarPrimeraLetra(info.via_administracion),
    //     capitalizarPrimeraLetra(info.presentacion),
    //     formatearPrecioConPuntos(precio), // Formatea precio con puntos
    //     cantidad,
    //   ];
    //   const row = crearFila(filaNueva);
    //   tbody.insertAdjacentElement("afterbegin", row);
    // }

    // Cierra modal o vuelve a vista base según el contexto
    esModal
      ? cerrarModal("create-medicament-inventory")
      : cerrarModalYVolverAVistaBase();
  });

  // Escucha eventos de click generales en el documento
  document.addEventListener("click", async (event) => {
    // Botón de retroceso
    const arrow = event.target.closest("#back-edit-medicament-inventory");
    if (arrow) {
      esModal
        ? cerrarModal("edit-medicament-inventory")
        : cerrarModalYVolverAVistaBase();
    }
  });
};
