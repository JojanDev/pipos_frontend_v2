import {
  success,
  crearElementoTratamiento,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  crearFila,
  error,
  cerrarModal,
} from "../../../../helpers";
import { listarEspecies } from "../../administrationController";

export const createSpecieController = (parametros = null) => {
  // const { idAntecedente } = parametros;

  const form = document.querySelector("#form-register-specie");
  const esModal = !location.hash.includes("especiesCrear");

  console.log(form);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;
    console.log(datos);

    const responseEspecie = await post("especies", datos);

    console.log(responseEspecie);

    if (!responseEspecie.success) {
      await error(responseEspecie.message);
      return;
    }

    await success(responseEspecie.message);

    listarEspecies();

    esModal ? cerrarModal("create-specie") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-register-specie");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("create-specie") : cerrarModalYVolverAVistaBase();
  });
};
