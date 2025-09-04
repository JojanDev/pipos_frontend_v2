import { layoutController } from "../layouts/layout";
import { DOMSelector } from "./dom";

export const renderLayout = async () => {
  const response = await fetch(`./src/layouts/mainLayout.html`);
  const html = await response.text();
  DOMSelector("#app").innerHTML = html;
  console.log("SI");

  await layoutController();
};

export const cargarComponente = async ({ path, controller }, param = null) => {
  try {
    // Cargamos el archivo HTML desde la ruta indicada
    const response = await fetch(`./src/views/${path}`);
    const html = await response.text();

    // Insertamos el HTML al final del contenedor, sin eliminar lo que ya tenía
    document
      .querySelector(`[data-slot="main"]`)
      .insertAdjacentHTML("beforeend", html);

    // Si hay controlador, lo ejecutamos
    if (typeof controller === "function") {
      controller(param);
    }
  } catch (error) {
    console.error("Error al cargar el componente:", error);
  }
};
