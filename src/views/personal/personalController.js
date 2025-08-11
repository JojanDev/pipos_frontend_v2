import { get, cargarTiposDocumento, crearFila } from "../../helpers";

export const cargarTablaEmpleados = async () => {
  const personales = await get("personal");

  console.log(personales);

  if (!personales.success) {
    await error(response.message);
  }

  const tbody = document.querySelector("#personal .table__body");
  tbody.innerHTML = "";

  const personalInfo = personales.data.map((personal) => {
    // console.log("cliente", cliente);

    const info = personal.info;
    // console.log("info", info);

    return [
      personal.id,
      personal.usuario,
      info.nombre,
      info.telefono,
      info.numeroDocumento,
      info.direccion,
    ];
  });

  console.log(personalInfo);

  personalInfo.forEach((personal) => {
    const row = crearFila(personal);
    tbody.append(row);
  });
};

export const personalController = async () => {
  cargarTablaEmpleados();

  const tablapersonal = document.querySelector("#personal");

  tablapersonal.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const id = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", id);
      location.hash = `#/personal/perfil/id=${id}`;
    }
  });
};
