import {
  success,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  error,
  cerrarModal,
  put,
  DOMSelector,
  successTemporal,
  configurarBotonCerrar,
} from "../../../../helpers";

export const editProductTypeController = (parametros = null) => {
  // Id de la especie
  const { id, nombre } = parametros;

  const form = DOMSelector("#form-edit-productType");
  const esModal = !location.hash.includes("tipos_productosEditar");

  const titulo = DOMSelector("#nombreTipo");

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

    successTemporal(responseTipo.message);
    // Justo después de insertar la nueva fila:
    const nombreTipoFila = DOMSelector(
      `#productsTypes [data-id="${id}"] td:nth-child(2)`
    );

    const titulo = DOMSelector("#productType-title");

    titulo.textContent = responseTipo.data.nombre;

    if (nombreTipoFila) {
      nombreTipoFila.textContent = responseTipo.data.nombre;
    }

    esModal ? cerrarModal("edit-productType") : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-edit-productType", esModal);
};
