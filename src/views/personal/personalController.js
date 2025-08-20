import {
  get,
  cargarTiposDocumento,
  crearFila,
  capitalizarPrimeraLetra,
} from "../../helpers";

export const cargarTablaEmpleados = async () => {
  const personales = await get("personal");
  console.log(personales);

  if (!personales.success) {
    await error(response.message);
  }

  const tbody = document.querySelector("#personal .table__body");
  tbody.innerHTML = "";

  const personalInfo = personales.data.map((personal) => {
    //

    const info = personal.info;
    //

    return [
      personal.id,
      personal.usuario,
      capitalizarPrimeraLetra(personal.rol.nombre),
      info.nombre,
      info.telefono,
      info.numeroDocumento,
      info.direccion,
    ];
  });

  personalInfo.forEach((personal) => {
    const row = crearFila(personal);

    const encontrado = personales.data.find((p) => p.id === personal[0]);
    console.log(encontrado);

    const activo = encontrado ? encontrado.activo : null;

    !activo ? row.classList.add("fila-alerta") : null;

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

      location.hash = `#/personal/perfil/id=${id}`;
    }
  });
};
