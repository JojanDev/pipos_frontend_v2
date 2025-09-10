import {
  get, // peticiones GET
  put, // peticiones PUT
  configurarEventosValidaciones, // inicializa validaciones del formulario
  validarCampos, // valida campos del formulario
  datos, // datos recolectados por los helpers/validaciones
  error, // muestra error
  successTemporal, // muestra mensaje de éxito temporal
  cerrarModal, // cierra modal por id
  DOMSelector, // selector simplificado del DOM
} from "../../../../helpers";
import { especiesConRazas } from "../../administrationController";

/**
 * Actualiza en memoria y en la tabla la raza modificada.
 * @param {number|string} idEspecie - ID de la especie a la que pertenece la raza.
 * @param {Object} razaActualizada - Objeto raza con al menos { id, nombre }.
 */
const updateRaza = (idEspecie, razaActualizada) => {
  // Busca la especie en el array global
  const especie = especiesConRazas.find((e) => e.id == idEspecie);
  if (!especie) return; // Si no existe, no hacer nada

  // Busca la raza dentro de la especie y actualiza su nombre en el array
  const raza = especie.razas.find((r) => r.id == razaActualizada.id);
  if (raza) {
    raza.nombre = razaActualizada.nombre;
  }

  // Si la especie está seleccionada en la UI, actualiza el texto en la fila correspondiente
  const especieSeleccionada = DOMSelector(".table__row--selected");
  if (especieSeleccionada?.children[0]?.textContent.trim() == idEspecie) {
    const razasTbody = DOMSelector("#breeds .table__body");
    // Busca la fila antigua por data-id y actualiza la columna del nombre
    const oldRow = razasTbody.querySelector(
      `[data-id='${razaActualizada.id}']`
    );
    if (oldRow) {
      const nombreRaza = oldRow.children[1];
      if (nombreRaza) nombreRaza.textContent = razaActualizada.nombre;
    }
  }
};

/**
 * Controlador que maneja la edición de una raza.
 * @param {Object|null} parametros - Parámetros de la vista (debe contener `perfil` con la raza).
 */
export const editBreedController = async (parametros = null) => {
  // Extrae la raza (perfil) de los parámetros
  const { perfil: raza } = parametros ?? {};

  // Selecciona el contenedor del modal para escuchar eventos de cierre
  const contenedorVista = DOMSelector(`[data-modal="edit-breed"]`);

  // Selecciona el formulario de edición
  const form = DOMSelector("#form-edit-breed");

  // Selector del input que muestra/nombra la raza en el modal
  const inputNombreRaza = DOMSelector("#nombreRaza");

  // Carga la raza actual desde el backend para asegurar datos actualizados
  const getRaza = await get(`razas/${raza.id}`);
  // Coloca el nombre actual en el input del modal
  inputNombreRaza.value = getRaza.data.nombre;

  // Inicializa las validaciones del formulario
  configurarEventosValidaciones(form);

  // Listener submit: envía la actualización si los campos son válidos
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita envío por defecto

    // Si validación falla, no continuar
    if (!validarCampos(e)) return;

    // Si el nombre no cambió, cierra modal y regresa sin llamar al backend
    if (getRaza.data.nombre == datos.nombre) {
      cerrarModal("edit-breed");
      history.back();
      return;
    }

    // Llamada PUT para actualizar la raza en el backend
    const responseEspecie = await put(`razas/${raza.id}`, {
      ...datos,
      especie_id: getRaza.data.especie_id,
    });

    // Si falla la petición, muestra error
    if (!responseEspecie.success) return await error(responseEspecie.message);

    // Muestra mensaje de éxito temporal
    successTemporal(responseEspecie.message);

    // Actualiza el array en memoria y la fila en la UI
    updateRaza(getRaza.data.especie_id, responseEspecie.data);

    // Actualiza el título de la vista/perfil con el nuevo nombre
    const breedTitleEl = DOMSelector("#breed-title");
    if (breedTitleEl) breedTitleEl.textContent = responseEspecie.data.nombre;

    // Cierra el modal y vuelve en el historial
    cerrarModal("edit-breed");
    history.back();
  });

  // Escucha clicks en el contenedor (por ejemplo, el botón 'back-edit-breed')
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-breed") {
      cerrarModal("edit-breed");
      history.back();
    }
  });
};
