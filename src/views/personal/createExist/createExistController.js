import {
  error,
  success,
  post,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelect,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  DOMSelector,
  get,
  DOMSelectorAll,
  successTemporal,
} from "../../../helpers";

const cargarEmpleadoNuevo = async (id) => {
  const usuario = await get("usuarios/" + id);
  console.log(usuario);

  if (!usuario.success) {
    await error(usuario.message);
  }

  const tbody = DOMSelector("#personal .table__body");
  // tbody.innerHTML = "";

  // const personalInfo =

  const rolesUsuario = await get(`roles-usuarios/usuario/${usuario.data.id}`);
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

  const row = crearFila([
    usuario.data.id,
    nombreRoles.join(", ") ?? "No aplica",
    `${usuario.data.nombre} ${usuario.data.apellido}`,
    usuario.data.telefono,
    usuario.data.numero_documento,
    usuario.data.direccion,
  ]);

  const credencialUsuario = await get(`credenciales/usuario/${id}`);

  if (credencialUsuario.success) {
    !credencialUsuario.data.activo ? row.classList.add("fila-alerta") : null;
  }

  tbody.insertAdjacentElement("afterbegin", row);
};

export const createPersonalExistController = async () => {
  const form = document.querySelector("#form-register-personalExist");
  const esModal = !location.hash.includes("personal/crearExistente");
  const selectUsuarios = DOMSelector("#select-info");

  llenarSelect({
    endpoint: "usuarios/no-empleados",
    selector: "#select-info",
    optionMapper: (info) => ({
      id: info.id,
      text: `${info.numero_documento} - ${info.nombre} ${info.apellido}`,
    }),
  });

  llenarSelect({
    endpoint: "roles/empleados",
    selector: "#select-roles",
    optionMapper: (rol) => ({
      id: rol.id,
      text: capitalizarPrimeraLetra(rol.nombre),
    }),
  });
  configurarEventosValidaciones(form);

  // Selecciona todos los elementos
  const credenciales = Array.from(form.querySelectorAll(".credenciales"));
  console.log(credenciales);

  selectUsuarios.addEventListener("change", async (e) => {
    if (selectUsuarios.value != -1) {
      const credencial = await get(
        `credenciales/usuario/${selectUsuarios.value}`
      );
      console.log(credencial);

      if (credencial.success) {
        credenciales.forEach((el) => el.remove());
      } else {
        if (!form.querySelector(".credenciales")) {
          const contenedorBtns = form.querySelector(".form__container-btns");
          credenciales.forEach((el) => contenedorBtns.before(el));
        }
      }
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    if (datos.usuario && datos.contrasena) {
      const usuarioExistente = await get(
        `credenciales/nickname/${datos.usuario}`
      );
      if (usuarioExistente.success)
        return await error("Nombre de usuario ya existe, escribe otro.");
      const credenciales = await post(`credenciales`, {
        usuario: datos.usuario,
        contrasena: datos.contrasena,
        usuario_id: datos.usuario_id,
      });
      console.log(credenciales);
    }

    // const response = await post("personal/infoExistente", datos);

    const rolUsuario = await post(`roles-usuarios/`, {
      usuario_id: datos.usuario_id,
      rol_id: datos.rol_id,
    });

    console.log(rolUsuario);

    successTemporal("Empleado registrado exitosamente");

    cargarEmpleadoNuevo(datos.usuario_id);

    cerrarModal("create-personalExist");
    history.back();
  });

  const btnAtras = document.querySelector("#back-create-personalExist");

  btnAtras.addEventListener("click", () => {
    cerrarModal("create-personalExist");
    history.back();
  });
};
