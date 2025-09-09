import {
  error,
  loginSuccess,
  success,
  get,
  post,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelect,
  capitalizarPrimeraLetra,
  llenarSelectTiposDocumentos,
  successTemporal,
  DOMSelector,
} from "../../../helpers";

export const createPersonalController = async () => {
  const form = document.querySelector("#form-register");
  const contenedorVista = DOMSelector(`#register-user`);
  const selectTipoDocumento = document.querySelector("#tipos-documento");

  await llenarSelect({
    endpoint: "roles/empleados",
    selector: "#select-roles",
    optionMapper: (rol) => ({
      id: rol.id,
      text: capitalizarPrimeraLetra(rol.nombre),
    }),
  });

  await llenarSelectTiposDocumentos();
  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const usuarioExistente = await get(
      `credenciales/nickname/${datos.usuario}`
    );

    if (usuarioExistente.success)
      return await error("Nombre de usuario ya existe, escribe otro.");

    const usuario = {
      nombre: datos.nombre,
      tipo_documento_id: datos.tipo_documento_id,
      numero_documento: datos.numero_documento,
      telefono: datos.telefono,
      correo: datos.correo,
      direccion: datos.direccion,
    };

    const response = await post("usuarios", usuario);

    console.log(response);

    if (!response.success) return error(response.message);

    const rolUsuario = await post(`roles-usuarios/`, {
      usuario_id: response.data.id,
      rol_id: datos.rol_id,
    });

    console.log(rolUsuario);

    const credenciales = await post(`credenciales`, {
      usuario: datos.usuario,
      contrasena: datos.contrasena,
      usuario_id: response.data.id,
    });

    console.log(credenciales);

    successTemporal(response.message);
    // window.location.hash = "#/personal";
    history.back();
  });

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "back-register-user") {
      history.back();
    }
  });
};
