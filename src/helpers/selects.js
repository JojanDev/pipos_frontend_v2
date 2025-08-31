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

export const renderizarSelectEspecies = async (selectEspecie, selectRazas) => {
  const especiesResponse = await get("especies");
  if (!especiesResponse.success) return;

  // Mantener la opción placeholder
  selectEspecie.innerHTML =
    `<option disabled selected value="">Seleccione una especie</option>` +
    especiesResponse.data
      .map((e) => `<option value="${e.id}">${e.nombre}</option>`)
      .join("");

  const actualizarRazas = async () => {
    const especieId = selectEspecie.value;
    if (!especieId) {
      selectRazas.innerHTML =
        '<option disabled selected value="">Seleccione una especie</option>';
      return;
    }

    const razasResponse = await get(`razas/especie/${especieId}`);
    if (!razasResponse.success) return;

    // Mantener placeholder en razas
    selectRazas.innerHTML =
      '<option disabled selected value="">Seleccione una raza</option>' +
      razasResponse.data
        .map((r) => `<option value="${r.id}">${r.nombre}</option>`)
        .join("");
  };

  selectEspecie.addEventListener("change", actualizarRazas);
  await actualizarRazas();
};
