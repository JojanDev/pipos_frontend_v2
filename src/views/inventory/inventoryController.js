import {
  capitalizarPrimeraLetra,
  cargarComponente,
  convertirADiaMesAño,
  crearFila,
  DOMSelector,
  errorTemporal,
  formatearPrecioConPuntos,
  get,
} from "../../helpers";
import hasPermission from "../../helpers/hasPermission";
import { routes } from "../../router/routes";

export const listarProductos = async () => {
  const responseProductos = await get("productos");
  // console.log(responseProductos);

  if (!responseProductos.success) return errorTemporal(response.message);

  const tbody = DOMSelector("#products .table__body");
  tbody.innerHTML = "";

  const productosFilas = await Promise.all(
    responseProductos.data.map(
      async ({
        id,
        nombre,
        tipo_producto_id,
        precio,
        stock,
        fecha_caducidad,
      }) => {
        const { data: tipoProducto } = await get(
          `tipos-productos/${tipo_producto_id}`
        );
        return [
          id,
          nombre,
          tipoProducto.nombre,
          formatearPrecioConPuntos(precio),
          stock,
          convertirADiaMesAño(fecha_caducidad),
        ];
      }
    )
  );

  productosFilas.forEach((producto) => {
    const row = crearFila(producto);

    producto[producto.length - 2] == 0
      ? row.classList.add("fila-alerta")
      : null;

    tbody.append(row);
  });
};

export const listarMedicamentos = async () => {
  const responseMedicamentos = await get("medicamentos");

  if (!responseMedicamentos.success) {
    // await error(response.message);
    //MESSAGE DE NO HAY MEDICAMENTOS REGISTRADOS
    return;
  }

  const tbody = DOMSelector("#medicaments .table__body");
  tbody.innerHTML = "";

  const medicamentosFilas = await Promise.all(
    responseMedicamentos.data.map(
      async ({ id, info_medicamento_id, precio, cantidad, numero_lote }) => {
        const { data: info } = await get(
          `info-medicamentos/${info_medicamento_id}`
        );
        return [
          id,
          numero_lote,
          info.nombre,
          info.uso_general,
          capitalizarPrimeraLetra(info.via_administracion),
          capitalizarPrimeraLetra(info.presentacion),
          formatearPrecioConPuntos(precio),
          cantidad,
        ];
      }
    )
  );

  medicamentosFilas.forEach((medicamento) => {
    const row = crearFila(medicamento);

    medicamento[medicamento.length - 1] == 0
      ? row.classList.add("fila-alerta")
      : null;

    tbody.append(row);
  });
};

export const inventoryController = () => {
  // const dataJSON = localStorage.getItem("data");
  // const data = JSON.parse(dataJSON);

  // if (data.id_rol != 1) {
  //   const opcionesAdmin = DOMSelectorAll(".admin");
  //   [...opcionesAdmin].forEach((element) => {
  //     element.remove();
  //   });
  // }

  listarProductos();
  listarMedicamentos();

  const vistaInventory = DOMSelector("#inventory");

  vistaInventory.addEventListener("click", (e) => { });

  const tablaProductos = DOMSelector("#products");

  // const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  // console.log(acciones);


  // for (const accion of acciones) {
  //   console.log(accion.dataset.permiso.split(","));
  //   console.log(hasPermission(accion.dataset.permiso.split(",")));
  //   if (!hasPermission(accion.dataset.permiso.split(","))) {
  //     accion.remove();
  //   }
  // }

  tablaProductos.addEventListener("click", async (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idProducto = fila.getAttribute("data-id");

      // location.hash = `#/inventario/productosPerfil/id=${idProducto}`;

      // if (data.id_rol == 1) {
      // await cargarComponente(routes.inventario.productosEditar, {
      //   id: idProducto,
      // });
      if (!hasPermission(["producto.update"])) {
        // return;
      }
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `productos/editar/id=${idProducto}`
          : `/productos/editar/id=${idProducto}`);
      // }

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });

  const tablaMedicamentos = DOMSelector("#medicaments");

  tablaMedicamentos.addEventListener("click", async (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const id = fila.getAttribute("data-id");

      // if (data.id_rol == 1) {
      // location.hash = `#/inventario/medicamentosEditar/id=${id}`;

      if (!hasPermission(["medicamento.update"])) {
        // return;
      }

      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `medicamentos/editar/id=${id}`
          : `/medicamentos/editar/id=${id}`);
      // }
      // await cargarComponente(routes);

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
