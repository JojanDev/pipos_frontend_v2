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
} from "../../../helpers";

export const createPersonalController = async () => {
  const form = document.querySelector("#form-register");
  const selectTipoDocumento = document.querySelector("#tipos-documento");

  await llenarSelect({
    endpoint: "roles",
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

    // //Se valida el inicio exitoso
    // if (response.success) {
    //   //Se muestra un mensaje
    //   await success(response.message);
    //   window.location.hash = "#/personal";
    // } else {
    //   //Se muestra un mensaje
    //   await error(response.message);
    // }
  });
};
