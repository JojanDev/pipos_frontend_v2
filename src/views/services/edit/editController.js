import {
  success,
  post,
  put,
  error,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  validarCampos,
  get,
  datos,
  formatearPrecioConPuntos,
  mapearDatosEnContenedor,
  configurarBotonCerrar,
  DOMSelector,
  successTemporal,
} from "../../../helpers";

export const editServiceController = async (parametros = null) => {
  console.log(parametros);

  // const { id } = parametros;
  const { editar: servicio } = parametros;

  const form = DOMSelector("#form-edit-service");
  const esModal = !location.hash.includes("servicios/editar");

  // 1. Obtener datos del servicio desde la API
  const response = await get(`servicios/${servicio.id}`);
  if (!response.success)
    return await error("No se pudo obtener la información del servicio.");

  mapearDatosEnContenedor(response.data, form);

  configurarEventosValidaciones(form);

  // 3. Manejar el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    if (
      nombre === datos.nombre &&
      descripcion === datos.descripcion &&
      precio === datos.precio
    ) {
      esModal ? cerrarModal("edit-service") : cerrarModalYVolverAVistaBase();
      return;
    }

    const responseUpdate = await put(`servicios/${servicio.id}`, datos);

    if (!responseUpdate.success) return await error(responseUpdate.message);

    successTemporal(responseUpdate.message);

    // Actualizar la card directamente (opcional)
    const card = DOMSelector(`.card[data-id="${servicio.id}"]`);

    if (card) {
      card.querySelector(".card__title").textContent =
        responseUpdate.data.nombre;
      card.querySelector(".card__description").textContent =
        responseUpdate.data.descripcion;
      card.querySelector(".card__precio").textContent =
        "Valor: " + formatearPrecioConPuntos(responseUpdate.data.precio);
    }

    esModal ? cerrarModal("edit-service") : cerrarModalYVolverAVistaBase();
  });

  const contenedorVista = DOMSelector(`[data-modal="edit-service"]`);

  contenedorVista.addEventListener('click', (e) => {
    if (e.target.id == "back-edit-service") {
      cerrarModal("edit-service");
      history.back();
    }
  });
};
