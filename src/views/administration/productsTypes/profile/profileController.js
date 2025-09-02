import { routes } from "../../../../router/routes";
import {
  error,
  convertirADiaMesAño,
  get,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  del,
  success,
  configurarBotonCerrar,
  DOMSelector,
} from "../../../../helpers";
import { listarTiposProductos } from "../../administrationController";

export const profileProductTypeController = async (parametros = null) => {
  const { id } = parametros;

  const modal = DOMSelector('[data-modal="productType-profile"]');
  const esModal = !location.hash.includes(
    "administrar_datos/tipos_productosPerfil"
  );

  const response = await get(`tipos-productos/${id}`);

  if (!response.success) {
    await error(response.message);
    esModal
      ? cerrarModal("productType-profile")
      : cerrarModalYVolverAVistaBase();
    return;
  }

  const titulo = DOMSelector("#productType-title");

  titulo.textContent = response.data.nombre;

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-productType") {
      await cargarComponente(routes.administrar_datos.tipos_productosEditar, {
        id: id,
        nombre: response.data.nombre,
      });
    }

    if (e.target.id == "delete-productType") {
      const response = await del(`tipos-productos/${id}`);

      if (response.success) {
        await success(response.message);
        listarTiposProductos();
        esModal
          ? cerrarModal("productType-profile")
          : cerrarModalYVolverAVistaBase();
      } else {
        await error(response.message);
        return;
      }
    }
  });

  configurarBotonCerrar("back-productType-profile", esModal);
};
