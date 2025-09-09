import { get, crearFila, DOMSelector, error } from "../../helpers";
import hasPermission from "../../helpers/hasPermission";

export const cargarTabla = async () => {
  const clientes = await get("usuarios/clientes");

  console.log(clientes);

  if (!clientes.success) {
    await error(clientes.message);
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

  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  tablaClientes.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idCliente = fila.getAttribute("data-id");

      // location.hash = `#/clientes/perfil/id=${idCliente}`;
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `perfil/id=${idCliente}`
          : `/perfil/id=${idCliente}`);
    }
  });
};
