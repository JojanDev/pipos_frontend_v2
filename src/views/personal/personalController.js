import { get, crearFila, capitalizarPrimeraLetra, error } from "../../helpers";

export const cargarTablaEmpleados = async () => {
  const usuarios = await get("usuarios");
  console.log(usuarios);

  if (!usuarios.success) {
    await error(usuarios.message);
  }

  const tbody = document.querySelector("#personal .table__body");
  tbody.innerHTML = "";

  const personalInfo = await Promise.all(
    usuarios.data.map(async (usuario) => {
      const rolesUsuario = await get(`roles-usuarios/usuario/${usuario.id}`);
      // console.log(rolesUsuario);
      let nombreRoles;
      if (!rolesUsuario.success) {
        nombreRoles = ["No aplica"];
      } else {
        nombreRoles = await Promise.all(
          rolesUsuario.data.map(async (roleUsuario) => {
            const { data: rol } = await get(`roles/${roleUsuario.rol_id}`);
            return capitalizarPrimeraLetra(rol.nombre);
          })
        );
      }

      console.log(nombreRoles);

      return [
        usuario.id,
        // personal.usuario,
        // "JJIJI",
        // capitalizarPrimeraLetra(personal.rol.nombre)
        nombreRoles.join(", ") ?? "No aplica",
        usuario.nombre,
        usuario.telefono,
        usuario.numero_documento,
        usuario.direccion,
      ];
    })
  );

  personalInfo.forEach((personal) => {
    const row = crearFila(personal);

    // const encontrado = usuarios.data.find((p) => p.id === personal[0]);
    // console.log(encontrado);

    // const activo = encontrado ? encontrado.activo : null;

    // !activo ? row.classList.add("fila-alerta") : null;

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
