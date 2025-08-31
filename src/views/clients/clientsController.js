import { get, crearFila, DOMSelector } from "../../helpers";

export const cargarTabla = async () => {
  const clientes = await get("usuarios/clientes");

  console.log(clientes);

  if (!clientes.success) {
    await error(response.message);
  }

  const tbody = DOMSelector("#clients .table__body");
  tbody.innerHTML = "";

  const clientesInfo = clientes.data.map((cliente) => {
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

  const tablaClientes = DOMSelector("#clients");

  tablaClientes.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idCliente = fila.getAttribute("data-id");

      location.hash = `#/clientes/perfil/id=${idCliente}`;
    }
  });
};
