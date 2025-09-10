import {
  post, // para crear la raza en el backend
  configurarEventosValidaciones, // configura validaciones en el formulario
  datos, // objeto global con los datos del formulario (helper)
  validarCampos, // valida campos del formulario
  crearFila, // crea una fila DOM para tablas
  cerrarModal, // cierra un modal por id
  error, // muestra mensaje de error
  successTemporal, // muestra mensaje de éxito temporal
  DOMSelector, // selector simplificado del DOM
} from "../../../../helpers";
import { especiesConRazas } from "../../administrationController.js";

/**
 * Añade una nueva raza al array `especiesConRazas` y actualiza la tabla en pantalla
 * si la especie correspondiente está seleccionada en la UI.
 *
 * @param {number|string} idEspecie - ID de la especie a la que pertenece la raza.
 * @param {Object} nuevaRaza - Objeto con los datos de la raza creada { id, nombre, ... }.
 */
const addRaza = (idEspecie, nuevaRaza) => {
  // Busca la especie en el array global de especies con sus razas
  const especie = especiesConRazas.find((e) => e.id == idEspecie);
  if (!especie) return; // Si no existe la especie en memoria, salir

  // 1) Actualiza el array en memoria añadiendo la nueva raza
  especie.razas.push(nuevaRaza);

  // 2) Si la especie está seleccionada actualmente en la tabla del DOM,
  //    insertamos la fila de la raza al inicio del tbody de razas
  const especieSeleccionada = DOMSelector(".table__row--selected");
  if (especieSeleccionada?.children[0]?.textContent.trim() == idEspecie) {
    const razasTbody = DOMSelector("#breeds .table__body");
    const row = crearFila([nuevaRaza.id, nuevaRaza.nombre]);
    // Inserta la nueva fila al inicio para que sea visible inmediatamente
    razasTbody.insertAdjacentElement("afterbegin", row);
  }

  // Si había un placeholder (mensaje) en la tabla de razas, lo removemos
  const placeholder = DOMSelector("#breeds .table__body .placeholder");
  placeholder?.remove();
};

/**
 * Controlador para la vista/ventana de creación de razas.
 * - Configura validaciones del formulario
 * - Envía la petición al backend para crear la raza
 * - Actualiza UI y memoria local (especiesConRazas) con la nueva raza
 *
 * @param {Object|null} parametros - Parámetros pasados desde la vista (debe contener `especies`).
 */
export const createBreedController = (parametros = null) => {
  // Extrae la especie desde los parámetros de invocación (si existen)
  const especies = parametros?.especies;

  // Selecciona el contenedor del modal de creación (para escuchar eventos de cierre)
  const contenedorVista = DOMSelector(`[data-modal="create-breed"]`);

  // Selecciona el formulario de registro de raza
  const form = DOMSelector("#form-register-breed");

  // Configura validaciones y eventos necesarios en el formulario
  configurarEventosValidaciones(form);

  // Listener submit del formulario para crear la raza
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del form

    // Valida los campos; si falla, no continuar
    if (!validarCampos(e)) return;

    // Llamada POST para crear la raza (envía `datos` + el id de la especie)
    const responseRaza = await post("razas", {
      ...datos,
      especie_id: especies.id,
    });

    // Si la respuesta no es exitosa, muestra el error y sale
    if (!responseRaza.success) return await error(responseRaza.message);

    // Muestra un mensaje de éxito temporal
    successTemporal(responseRaza.message);

    // Actualiza memoria local y UI con la nueva raza
    addRaza(especies.id, responseRaza.data);

    // Cierra el modal de creación y vuelve hacia atrás en el historial
    cerrarModal("create-breed");
    history.back();
  });

  // Listener para el botón de cierre dentro del modal (id = back-register-breed)
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-register-breed") {
      // Si se pulsa el botón de volver, cerrar modal y regresar
      cerrarModal("create-breed");
      history.back();
    }
  });
};
