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
} from "../../../../helpers";
import { listarTiposProductos } from "../../administrationController";

export const profileProductTypeController = async (parametros = null) => {
  const { id } = parametros;
  console.log(id, "ID producto");

  const modal = document.querySelector('[data-modal="productType-profile"]');
  const esModal = !location.hash.includes(
    "administrar_datos/tipos_productosPerfil"
  );

  const response = await get(`tipos-productos/${id}`);
  console.log(response);

  if (!response.success) {
    await error(response.message);
    esModal
      ? cerrarModal("productType-profile")
      : cerrarModalYVolverAVistaBase();
    return;
  }

  const titulo = document.querySelector("#productType-title");

  titulo.textContent = response.data.nombre;

  modal.addEventListener("click", async (e) => {
    console.log(e.target);

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

    if (e.target.id == "back-productType-profile") {
      esModal
        ? cerrarModal("productType-profile")
        : cerrarModalYVolverAVistaBase();
    }
  });
};
