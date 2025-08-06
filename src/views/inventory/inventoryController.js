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

const listarMedicamentos = async () => {
  const responseMedicamentos = await get("medicamentos");

  console.log(responseMedicamentos);

  if (!responseMedicamentos.success) {
    // await error(response.message);
    //MESSAGE DE NO HAY MEDICAMENTOS REGISTRADOS
    return;
  }

  const tbody = document.querySelector("#medicaments .table__body");

  const medicamentosFilas = responseMedicamentos.data.map(
    ({ id, info, precio, stock }) => {
      return [
        id,
        info.nombre,
        info.uso_general,
        capitalizarPrimeraLetra(info.especie_destinada),
        capitalizarPrimeraLetra(info.via_administracion),
        capitalizarPrimeraLetra(info.presentacion),
        formatearPrecioConPuntos(precio),
        stock,
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
};
