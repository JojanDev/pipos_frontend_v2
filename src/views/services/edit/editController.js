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
} from "../../../helpers";

export const editServiceController = async (parametros = null) => {
  const { id } = parametros;

  const form = document.querySelector("#form-edit-service");
  const esModal = !location.hash.includes("servicios/editar");

  // 1. Obtener datos del servicio desde la API
  const response = await get(`servicios/${id}`);
  if (!response.success) {
    await error("No se pudo obtener la información del servicio.");
    return;
  }

  const { nombre, descripcion, precio } = response.data;

  // 2. Asignar los valores a los inputs
  const inputNombre = document.querySelector("#nombreServicio");
  const inputDescripcion = document.querySelector("#descripcionServicio");
  const inputPrecio = document.querySelector("#precioServicio");

  inputNombre.value = nombre;
  inputDescripcion.value = descripcion;
  inputPrecio.value = precio;

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

    const responseUpdate = await put(`servicios/${id}`, datos);

    if (!responseUpdate.success) {
      await error(responseUpdate.message);
      return;
    }

    await success(responseUpdate.message);

    // Actualizar la card directamente (opcional)
    const card = document.querySelector(`.card[data-id="${id}"]`);
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

  const btnAtras = document.querySelector("#back-edit-service");
  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("edit-service") : cerrarModalYVolverAVistaBase();
  });
};
