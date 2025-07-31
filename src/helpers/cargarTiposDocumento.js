import { get } from "./api";

export const cargarTiposDocumento = async (select) => {
  const response = await get("tipos-documentos");

  if (!response.success) {
    await error(response.message);
    return;
  }

  response.data.forEach((tipo) => {
    const option = document.createElement("option");
    option.value = tipo.id;
    option.textContent = tipo.nombre;
    select.appendChild(option);
  });
};

// Ejemplo de usabilidad
// await llenarSelect({
//     endpoint: 'tipos-documento',
//     selector: '#tipos-documentos',
//     optionMapper: tipo => ({ id: tipo.id, text: tipo.nombre })
// });

// funcion
export async function llenarSelect({ endpoint, selector, optionMapper }) {
  const select = document.querySelector(selector);

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
