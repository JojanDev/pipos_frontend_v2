export const renderLayout = async (container, layout) => {
  const response = await fetch(`./src/layouts/${layout}`);
  const html = await response.text();
  container.innerHTML = html;
};

export const cargarComponente = async (
  { path, container, controller },
  param = null
) => {
  try {
    // Cargamos el archivo HTML desde la ruta indicada
    const response = await fetch(`./src/views/${path}`);
    const html = await response.text();

    // Insertamos el HTML al final del contenedor, sin eliminar lo que ya tenía
    container.insertAdjacentHTML("beforeend", html);

    // Si hay controlador, lo ejecutamos
    if (typeof controller === "function") {
      controller(param);
    }
  } catch (error) {
    console.error("Error al cargar el componente:", error);
  }
};
