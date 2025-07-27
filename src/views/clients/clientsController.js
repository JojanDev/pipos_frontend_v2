import { get } from "../../helpers/api.js";
import { cargarTiposDocumento } from "../../helpers/cargarTiposDocumento.js";

const crearCliente = ({
  id,
  info: { correo, direccion, numeroDocumento, nombre, telefono },
}) => {
  const tr = document.createElement("tr");

  const tdId = document.createElement("td");
  const tdCliente = document.createElement("td");
  const tdDocumento = document.createElement("td");
  const tdDireccion = document.createElement("td");
  const tdTelefono = document.createElement("td");
  const tdEmail = document.createElement("td");

  tr.setAttribute("data-id", id);

  tdId.textContent = id;
  tdCliente.textContent = nombre;
  tdDireccion.textContent = direccion;
  tdDocumento.textContent = numeroDocumento;
  tdTelefono.textContent = telefono;
  tdEmail.textContent = correo;

  tr.classList.add("table__row-body");

  tdId.classList.add("table__cell-body");
  tdCliente.classList.add("table__cell-body");
  tdTelefono.classList.add("table__cell-body");
  tdDocumento.classList.add("table__cell-body");
  tdDireccion.classList.add("table__cell-body");
  tdEmail.classList.add("table__cell-body");

  tr.append(tdId, tdCliente, tdTelefono, tdDocumento, tdDireccion, tdEmail);
  return tr;
};

const cargarTabla = async () => {
  const clientes = await get("clientes");

  console.log(clientes);

  if (!clientes.success) {
    await error(response.message);
  }

  const tbody = document.querySelector(".table__body");

  clientes.data.forEach((cliente) => {
    const row = crearCliente(cliente);
    tbody.append(row);
  });
};

export const clientsController = async () => {
  cargarTabla();

  const tablaClientes = document.querySelector("#clientes");

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
