import {
  success,
  crearElementoTratamiento,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  crearFila,
  cerrarModal,
  error,
} from "../../../../helpers";
import { listarEspecies } from "../../administrationController";

export const createBreedController = (parametros = null) => {
  const { id_especie } = parametros;

  const form = document.querySelector("#form-register-breed");
  const esModal = !location.hash.includes("razasCrear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    datos["id_especie"] = id_especie;

    const responseRaza = await post("razas", datos);

    if (!responseRaza.success) {
      await error(responseRaza.message);
      return;
    }

    await success(responseRaza.message);

    listarEspecies();

    esModal ? cerrarModal("create-breed") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-register-breed");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("create-breed") : cerrarModalYVolverAVistaBase();
  });
};
