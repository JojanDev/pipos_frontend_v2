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
