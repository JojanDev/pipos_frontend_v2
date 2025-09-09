import {
  get,
  crearFila,
  capitalizarPrimeraLetra,
  error,
  DOMSelector,
} from "../../helpers";
import hasPermission from "../../helpers/hasPermission";

export const cargarTablaEmpleados = async () => {
  const usuarios = await get("usuarios/empleados");
  console.log(usuarios);

  if (!usuarios.success) {
    await error(usuarios.message);
  }

  const tbody = DOMSelector("#personal .table__body");
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

      return [
        usuario.id,
        nombreRoles.join(", ") ?? "No aplica",
        usuario.nombre,
        usuario.telefono,
        usuario.numero_documento,
        usuario.direccion,
      ];
    })
  );

  await Promise.all(
    personalInfo.map(async (personal) => {
      const row = crearFila(personal);

      const credencialUsuario = await get(`credenciales/${personal[0]}`);

      if (credencialUsuario.success) {
        !credencialUsuario.data.activo
          ? row.classList.add("fila-alerta")
          : null;
      }

      tbody.append(row);
    })
  );
};

export const personalController = async () => {
  await cargarTablaEmpleados();

  const tablapersonal = DOMSelector("#personal");
  const contenedorVista = DOMSelector("#vista-usuarios");

  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  tablapersonal.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const id = fila.getAttribute("data-id");

      // location.hash = `#/personal/perfil/id=${id}`;
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `perfil/id=${id}`
          : `/perfil/id=${id}`);
    }
  });
};
