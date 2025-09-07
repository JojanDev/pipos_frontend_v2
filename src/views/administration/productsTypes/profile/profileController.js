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
  successTemporal,
} from "../../../../helpers";
import { listarTiposProductos } from "../../administrationController";

export const profileProductTypeController = async (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="productType-profile"]`);

  // const { id } = parametros;
  const { perfil: tipoProducto } = parametros;

  const modal = DOMSelector('[data-modal="productType-profile"]');
  const esModal = !location.hash.includes(
    "administrar_datos/tipos_productosPerfil"
  );

  const response = await get(`tipos-productos/${tipoProducto.id}`);

  if (!response.success) {
    await error(response.message);
    cerrarModal("productType-profile");
    history.back();
    return;
  }

  const titulo = DOMSelector("#productType-title");

  titulo.textContent = response.data.nombre;

  // const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  // console.log(acciones);

  // for (const accion of acciones) {
  //   console.log(accion.dataset.permiso.split(","));
  //   console.log(hasPermission(accion.dataset.permiso.split(",")));
  //   if (!hasPermission(accion.dataset.permiso.split(","))) {
  //     accion.remove();
  //   }
  // }

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "edit-productType") {
      // await cargarComponente(routes.administrar_datos.tipos_productosEditar, {
      //   id: tipoProducto.id,
      //   nombre: response.data.nombre,
      // });
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "delete-productType") {
      const response = await del(`tipos-productos/${tipoProducto.id}`);

      if (response.success) {
        successTemporal(response.message);
        const fila = DOMSelector(
          `#productsTypes [data-id="${tipoProducto.id}"]`
        );
        fila.remove();
        cerrarModal("productType-profile");
        history.back();
      } else {
        await error(response.message);
        return;
      }
    }
  });

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-productType-profile") {
      cerrarModal("productType-profile");
      history.back();
    }
  });
};
