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
  successTemporal,
  configurarBotonCerrar,
  DOMSelector,
} from "../../../../helpers";
import { especiesConRazas } from "../../administrationController.js";

const addRaza = (idEspecie, nuevaRaza) => {
  const especie = especiesConRazas.find((e) => e.id == idEspecie);
  console.log(especie);

  if (!especie) return;
  console.log(especie);

  // 1. actualizar array
  especie.razas.push(nuevaRaza);

  // 2. si está seleccionada en el DOM, actualizar la tabla
  const especieSeleccionada = DOMSelector(".table__row--selected");
  if (especieSeleccionada?.children[0]?.textContent.trim() == idEspecie) {
    const razasTbody = DOMSelector("#breeds .table__body");
    const row = crearFila([nuevaRaza.id, nuevaRaza.nombre]);
    razasTbody.insertAdjacentElement("afterbegin", row);
  }
};

export const createBreedController = (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="create-breed"]`);

  const { especies } = parametros;

  const form = DOMSelector("#form-register-breed");
  const esModal = !location.hash.includes("razasCrear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const responseRaza = await post("razas", {
      ...datos,
      especie_id: especies.id,
    });

    if (!responseRaza.success) return await error(responseRaza.message);

    successTemporal(responseRaza.message);

    addRaza(especies.id, responseRaza.data);

    cerrarModal("create-breed");
    history.back();
  });

  // configurarBotonCerrar("back-register-breed", esModal);

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-register-breed") {
      cerrarModal("create-breed");

      history.back();
    }
  });
};
