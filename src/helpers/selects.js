import { get } from "./api";
import { DOMSelector } from "./dom";

// Ejemplo de usabilidad
// await llenarSelect({
//     endpoint: 'tipos-documento',
//     selector: '#tipos-documentos',
//     optionMapper: tipo => ({ id: tipo.id, text: tipo.id })
// });

// funcion
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

export const llenarSelectClientes = async () => {
  return await llenarSelect({
    endpoint: "usuarios/clientes",
    selector: "#select-clients",
    optionMapper: (c) => ({
      id: c.id,
      text: `${c.numero_documento} - ${c.nombre}`,
    }),
  });
};

export const llenarSelectTiposDocumentos = async () => {
  return await llenarSelect({
    endpoint: "tipos-documentos",
    selector: "#select-tipos-documentos",
    optionMapper: (t) => ({
      id: t.id,
      text: t.nombre,
    }),
  });
};

export const llenarSelectVeterinarios = async () => {
  return await llenarSelect({
    endpoint: "usuarios/veterinarios/",
    selector: "#select-veterinarios",
    optionMapper: (veterinario) => ({
      id: veterinario.id,
      text: veterinario.nombre,
    }),
  });
};

export const llenarSelectMedicamentos = async () => {
  return llenarSelect({
    endpoint: "medicamentos",
    selector: "#select-elementos",
    optionMapper: (elemento) => ({
      id: elemento.id,
      text: `${elemento.numero_lote} - ${elemento.nombre}`,
    }),
  });
};

export const llenarSelectProductos = async () => {
  return llenarSelect({
    endpoint: "productos",
    selector: "#select-elementos",
    optionMapper: (elemento) => ({
      id: elemento.id,
      text: `${elemento.tipo_producto} - ${elemento.nombre}`,
    }),
  });
};

export const renderizarSelectEspecies = async (selectEspecie, selectRazas) => {
  const especiesResp = await get("especies");
  if (!especiesResp.success) return;

  selectEspecie.innerHTML =
    '<option disabled selected value="">Seleccione una especie</option>' +
    especiesResp.data
      .map((e) => `<option value="${e.id}">${e.nombre}</option>`)
      .join("");

  // función reutilizable para cargar razas
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

  // 4. bind del change (no await aquí)
  selectEspecie.addEventListener("change", actualizarRazas);

  // 5. carga inicial de razas
  await actualizarRazas();

  // Devolvemos la función para usarla en el init
  return actualizarRazas;
};
