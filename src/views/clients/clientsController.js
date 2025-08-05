import { get, cargarTiposDocumento, crearFila } from "../../helpers";

const cargarTabla = async () => {
  const clientes = await get("clientes");

  console.log(clientes);

  if (!clientes.success) {
    await error(response.message);
  }

  const tbody = document.querySelector("#clients .table__body");

  const clientesInfo = clientes.data.map((cliente) => {
    // console.log("cliente", cliente);

    const info = cliente.info;
    // console.log("info", info);

    return [
      cliente.id,
      info.nombre,
      info.telefono,
      info.numeroDocumento,
      info.direccion,
    ];
  });

  console.log(clientesInfo);

  clientesInfo.forEach((cliente) => {
    const row = crearFila(cliente);
    tbody.append(row);
  });
};

export const clientsController = async () => {
  cargarTabla();

  const tablaClientes = document.querySelector("#clients");

  tablaClientes.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idCliente = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", idCliente);
      location.hash = `#/clientes/perfil/id=${idCliente}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
