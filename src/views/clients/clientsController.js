import { get, cargarTiposDocumento, crearFila } from "../../helpers";

export const cargarTabla = async () => {
  const clientes = await get("usuarios/clientes");

  if (!clientes.success) {
    await error(response.message);
  }

  const tbody = document.querySelector("#clients .table__body");
  tbody.innerHTML = "";

  const clientesInfo = clientes.data.map((cliente) => {
    //
    console.log(cliente);

    const info = cliente.info;
    //

    return [
      cliente.id,
      cliente.nombre,
      cliente.telefono,
      cliente.numero_documento,
      cliente.direccion,
    ];
  });

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

      location.hash = `#/clientes/perfil/id=${idCliente}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
