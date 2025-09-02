import {
  success,
  crearElementoTratamiento,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  crearFila,
  successTemporal,
  error,
  configurarBotonCerrar,
} from "../../../../helpers";

export const createProductTypeController = (parametros = null) => {
  // const { idAntecedente } = parametros;

  const form = document.querySelector("#form-register-productType");
  const esModal = !location.hash.includes("tipos_productosCrear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const responseTipoProducto = await post("tipos-productos", datos);

    if (!responseTipoProducto.success)
      return await error(responseTipoProducto.message);

    successTemporal(responseTipoProducto.message);

    // Justo después de insertar la nueva fila:
    const tbody = document.querySelector("#productsTypes .table__body");

    if (tbody) {
      // 🔴 1. Eliminar el <p class="placeholder"> si existe
      const placeholder = tbody.querySelector(".placeholder");
      if (placeholder) placeholder.remove();

      // ✅ 2. Insertar la nueva fila
      const { id, nombre } = responseTipoProducto.data;
      const row = crearFila([id, nombre]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    esModal
      ? cerrarModal("create-productType")
      : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-register-productType", esModal);
};
