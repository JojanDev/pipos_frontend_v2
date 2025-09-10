import { get } from "./api";
import { DOMSelector } from "./domMapper";

/**
 * Llena un elemento <select> con opciones obtenidas de la API.
 *
 * @param {Object}   params
 * @param {string}   params.endpoint     - Ruta del recurso en la API.
 * @param {string}   params.selector     - Selector CSS del <select> a poblar.
 * @param {Function} params.optionMapper - Función que recibe cada ítem de datos
 *                                         y devuelve un objeto { id, text }.
 * @returns {Promise<void>}
 */
export async function llenarSelect({ endpoint, selector, optionMapper }) {
  const select = DOMSelector(selector);
  const respuesta = await get(endpoint);

  if (!respuesta.success) {
    console.error(respuesta.message || respuesta.errors);
    return;
  }

  respuesta.data.forEach((item) => {
    const { id, text } = optionMapper(item);
    const option = document.createElement("option");
    option.value = id;
    option.textContent = text;
    select.appendChild(option);
  });
}

/**
 * Llena el <select> de clientes con su número de documento y nombre completo.
 *
 * @returns {Promise<void>}
 */
export const llenarSelectClientes = async () => {
  await llenarSelect({
    endpoint: "usuarios/clientes",
    selector: "#select-clients",
    optionMapper: (c) => ({
      id: c.id,
      text: `${c.numero_documento} - ${c.nombre} ${c.apellido}`,
    }),
  });
};

/**
 * Llena el <select> de tipos de documento.
 *
 * @returns {Promise<void>}
 */
export const llenarSelectTiposDocumentos = async () => {
  await llenarSelect({
    endpoint: "tipos-documentos",
    selector: "#select-tipos-documentos",
    optionMapper: (t) => ({
      id: t.id,
      text: t.nombre,
    }),
  });
};

/**
 * Llena el <select> de veterinarios con nombre y apellido.
 *
 * @returns {Promise<void>}
 */
export const llenarSelectVeterinarios = async () => {
  await llenarSelect({
    endpoint: "usuarios/veterinarios",
    selector: "#select-veterinarios",
    optionMapper: (v) => ({
      id: v.id,
      text: `${v.nombre} ${v.apellido}`,
    }),
  });
};

/**
 * Llena el <select> de medicamentos (todos los lotes).
 *
 * @returns {Promise<void>}
 */
export const llenarSelectMedicamentos = async () => {
  await llenarSelect({
    endpoint: "medicamentos",
    selector: "#select-elementos",
    optionMapper: (m) => ({
      id: m.id,
      text: `${m.numero_lote} - ${m.nombre}`,
    }),
  });
};

/**
 * Llena el <select> de medicamentos con stock disponible.
 *
 * @returns {Promise<void>}
 */
export const llenarSelectMedicamentosStock = async () => {
  await llenarSelect({
    endpoint: "medicamentos/stock",
    selector: "#select-elementos",
    optionMapper: (m) => ({
      id: m.id,
      text: `${m.numero_lote} - ${m.nombre}`,
    }),
  });
};

/**
 * Llena el <select> de productos (todos los tipos).
 *
 * @returns {Promise<void>}
 */
export const llenarSelectProductos = async () => {
  await llenarSelect({
    endpoint: "productos",
    selector: "#select-elementos",
    optionMapper: (p) => ({
      id: p.id,
      text: `${p.tipo_producto} - ${p.nombre}`,
    }),
  });
};

/**
 * Llena el <select> de productos con stock disponible.
 *
 * @returns {Promise<void>}
 */
export const llenarSelectProductosStock = async () => {
  await llenarSelect({
    endpoint: "productos/stock",
    selector: "#select-elementos",
    optionMapper: (p) => ({
      id: p.id,
      text: `${p.tipo_producto} - ${p.nombre}`,
    }),
  });
};

/**
 * Renderiza el <select> de especies y enlaza su cambio para actualizar razas.
 *
 * @param {HTMLSelectElement} selectEspecie - Elemento <select> de especies.
 * @param {HTMLSelectElement} selectRazas   - Elemento <select> de razas.
 * @returns {Promise<Function>} Función que recarga las razas según la especie seleccionada.
 */
export const renderizarSelectEspecies = async (selectEspecie, selectRazas) => {
  const especiesResp = await get("especies");
  if (!especiesResp.success) return;

  selectEspecie.innerHTML =
    '<option disabled selected value="">Seleccione una especie</option>' +
    especiesResp.data
      .map((e) => `<option value="${e.id}">${e.nombre}</option>`)
      .join("");

  /**
   * Carga las razas para la especie seleccionada.
   *
   * @returns {Promise<void>}
   */
  const actualizarRazas = async () => {
    const especieId = selectEspecie.value;
    if (!especieId) {
      selectRazas.innerHTML =
        '<option disabled selected value="">Seleccione una especie</option>';
      return;
    }

    const razasResp = await get(`razas/especie/${especieId}`);
    if (!razasResp.success) return;

    selectRazas.innerHTML =
      '<option disabled selected value="">Seleccione una raza</option>' +
      razasResp.data
        .map((r) => `<option value="${r.id}">${r.nombre}</option>`)
        .join("");
  };

  selectEspecie.addEventListener("change", actualizarRazas);
  await actualizarRazas();

  return actualizarRazas;
};
