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
  DOMSelector,
  successTemporal,
} from "../../../../helpers";
import { listarEspecies } from "../../administrationController";

export const createSpecieController = (parametros = null) => {
  const form = document.querySelector("#form-register-specie");
  const esModal = !location.hash.includes("especiesCrear");
  const tbody = DOMSelector("#species .table__body");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const responseEspecie = await post("especies", datos);

    if (!responseEspecie.success) {
      await error(responseEspecie.message);
      return;
    }

    successTemporal(responseEspecie.message);

    // listarEspecies();
    const btn = document.createElement("button");
    const i = document.createElement("i");
    btn.append(i);
    i.classList.add("ri-edit-box-line");
    btn.classList.add("btn", "btn--edit");

    const row = crearFila([
      responseEspecie.data.id,
      responseEspecie.data.nombre,
      btn,
    ]);

    tbody.insertAdjacentElement("afterbegin", row);

    esModal ? cerrarModal("create-specie") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-register-specie");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("create-specie") : cerrarModalYVolverAVistaBase();
  });
};
