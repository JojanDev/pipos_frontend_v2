import {
  success,
  crearElementoTratamiento,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  crearFila,
  error,
  cerrarModal,
  put,
} from "../../../../helpers";

export const editProductTypeController = (parametros = null) => {
  // Id de la especie
  const { id, nombre } = parametros;

  const form = document.querySelector("#form-edit-productType");
  const esModal = !location.hash.includes("tipos_productosEditar");

  const titulo = document.querySelector("#nombreTipo");

  titulo.value = nombre;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;

    if (nombre == datos.nombre) {
      esModal
        ? cerrarModal("edit-productType")
        : cerrarModalYVolverAVistaBase();

      return;
    }

    const responseTipo = await put(`tipos-productos/${id}`, datos);

    if (!responseTipo.success) {
      await error(responseTipo.message);
      return;
    }

    await success(responseTipo.message);
    // Justo después de insertar la nueva fila:
    const nombreTipoFila = document.querySelector(
      `#productsTypes [data-id="${id}"] td:nth-child(2)`
    );

    const titulo = document.querySelector("#productType-title");

    titulo.textContent = responseTipo.data.nombre;

    if (nombreTipoFila) {
      nombreTipoFila.textContent = responseTipo.data.nombre;
    }

    esModal ? cerrarModal("edit-productType") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-edit-productType");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("edit-productType") : cerrarModalYVolverAVistaBase();
  });
};
