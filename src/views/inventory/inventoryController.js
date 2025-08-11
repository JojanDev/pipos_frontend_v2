import {
  capitalizarPrimeraLetra,
  convertirADiaMesAño,
  crearFila,
  formatearPrecioConPuntos,
  get,
} from "../../helpers";

const listarProductos = async () => {
  const responseProductos = await get("productos");

  console.log(responseProductos);

  if (!responseProductos.success) {
    // await error(response.message);
    //MESSAGE DE NO HAY MEDICAMENTOS REGISTRADOS
    return;
  }

  const tbody = document.querySelector("#products .table__body");

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
  console.log(productosFilas);

  productosFilas.forEach((producto) => {
    const row = crearFila(producto);
    tbody.append(row);
  });
};

export const listarMedicamentos = async () => {
  const responseMedicamentos = await get("medicamentos");

  console.log(responseMedicamentos);

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
  console.log(medicamentosFilas);
  medicamentosFilas.forEach((medicamento) => {
    const row = crearFila(medicamento);
    tbody.append(row);
  });
};

export const inventoryController = () => {
  listarProductos();
  listarMedicamentos();

  const vistaInventory = document.querySelector("#inventory");

  vistaInventory.addEventListener("click", (e) => {});

  // const tablaProductos = document.querySelector("#products");

  // tablaProductos.addEventListener("click", (event) => {
  //   const fila = event.target.closest("tr[data-id]");

  //   if (fila) {
  //     const idProducto = fila.getAttribute("data-id");
  //     console.log("Cliente clickeado con ID:", idProducto);
  //     location.hash = `#/inventario/productosPerfil/id=${idProducto}`;

  //     // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
  //     // ejemplo: mostrarDetalleCliente(idCliente);
  //   }
  // });

  const tablaMedicamentos = document.querySelector("#medicaments");

  tablaMedicamentos.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const id = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", id);
      location.hash = `#/inventario/medicamentosPerfil/id=${id}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
