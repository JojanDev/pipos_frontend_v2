import {
  error,
  loginSuccess,
  success,
  get,
  post,
  cargarTiposDocumento,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelect,
  capitalizarPrimeraLetra,
} from "../../../helpers";

export const createPersonalController = async () => {
  const form = document.querySelector("#form-register");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  await cargarTiposDocumento(selectTipoDocumento);

  llenarSelect({
    endpoint: "roles",
    selector: "#select-roles",
    optionMapper: (rol) => ({
      id: rol.id,
      text: capitalizarPrimeraLetra(rol.nombre),
    }),
  });
  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await post("personal", datos);

    //Se valida el inicio exitoso
    if (response.success) {
      //Se muestra un mensaje
      await success(response.message);
      window.location.hash = "#/personal";
    } else {
      //Se muestra un mensaje
      await error(response.message);
    }
  });
};
