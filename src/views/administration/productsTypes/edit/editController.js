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
  get,
} from "../../../../helpers";

export const editProductTypeController = async (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="edit-productType"]`);
  // Id de la especie
  // const { id, nombre } = parametros;
  const { perfil: tipoProducto } = parametros;

  const form = DOMSelector("#form-edit-productType");
  const esModal = !location.hash.includes("tipos_productosEditar");

  const titulo = DOMSelector("#nombreTipo");

  const getTipoProducto = await get(`tipos-productos/${tipoProducto.id}`);

  titulo.value = getTipoProducto.data.nombre;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;

    if (getTipoProducto.data.nombre == datos.nombre) {
      cerrarModal("edit-productType");
      history.back();
      return;
    }

    const responseTipo = await put(`tipos-productos/${tipoProducto.id}`, datos);

    if (!responseTipo.success) return await error(responseTipo.message);

    successTemporal(responseTipo.message);
    // Justo después de insertar la nueva fila:
    const nombreTipoFila = DOMSelector(
      `#productsTypes [data-id="${tipoProducto.id}"] td:nth-child(2)`
    );

    const titulo = DOMSelector("#productType-title");

    titulo.textContent = responseTipo.data.nombre;

    if (nombreTipoFila) {
      nombreTipoFila.textContent = responseTipo.data.nombre;
    }

    cerrarModal("edit-productType");
    history.back();
  });

  // configurarBotonCerrar("back-edit-productType", esModal);

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-productType") {
      cerrarModal("edit-productType");
      history.back();
    }
  });
};
