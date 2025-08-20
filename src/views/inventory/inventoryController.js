import {
  capitalizarPrimeraLetra,
  cargarComponente,
  convertirADiaMesAño,
  crearFila,
  formatearPrecioConPuntos,
  get,
} from "../../helpers";
import { routes } from "../../router/routes";

export const listarProductos = async () => {
  const responseProductos = await get("productos");

  if (!responseProductos.success) {
    // await error(response.message);
    //MESSAGE DE NO HAY MEDICAMENTOS REGISTRADOS
    return;
  }

  const tbody = document.querySelector("#products .table__body");
  tbody.innerHTML = "";

  const productosFilas = responseProductos.data.map(
    ({ id, nombre, tipoProducto, precio, stock, fecha_caducidad }) => {
      return [
        id,
        nombre,
        tipoProducto.nombre,
        formatearPrecioConPuntos(precio),
        stock,
        convertirADiaMesAño(fecha_caducidad),
      ];
    }
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

  const tbody = document.querySelector("#medicaments .table__body");
  tbody.innerHTML = "";

  const medicamentosFilas = responseMedicamentos.data.map(
    ({ id, info, precio, cantidad, numero_lote }) => {
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
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  if (data.id_rol != 1) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }

  listarProductos();
  listarMedicamentos();

  const vistaInventory = document.querySelector("#inventory");

  vistaInventory.addEventListener("click", (e) => {});

  const tablaProductos = document.querySelector("#products");

  tablaProductos.addEventListener("click", async (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idProducto = fila.getAttribute("data-id");

      // location.hash = `#/inventario/productosPerfil/id=${idProducto}`;

      if (data.id_rol == 1) {
        await cargarComponente(routes.inventario.productosEditar, {
          id: idProducto,
        });
      }

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });

  const tablaMedicamentos = document.querySelector("#medicaments");

  tablaMedicamentos.addEventListener("click", async (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const id = fila.getAttribute("data-id");

      if (data.id_rol == 1) {
        location.hash = `#/inventario/medicamentosEditar/id=${id}`;
      }
      // await cargarComponente(routes);

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
