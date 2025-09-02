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
  if (!especie) return;

  // 1. actualizar array
  especie.razas.push(nuevaRaza);

  // 2. si está seleccionada en el DOM, actualizar la tabla
  const especieSeleccionada = DOMSelector(".table__row--selected");
  if (especieSeleccionada?.children[0]?.textContent.trim() == idEspecie) {
    const razasTbody = DOMSelector("#breeds .table__body");
    const row = crearFila([nuevaRaza.id, nuevaRaza.nombre]);
    razasTbody.append(row);
  }
};

export const createBreedController = (parametros = null) => {
  const { id: especie_id } = parametros;

  const form = DOMSelector("#form-register-breed");
  const esModal = !location.hash.includes("razasCrear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const responseRaza = await post("razas", { ...datos, especie_id });

    if (!responseRaza.success) {
      await error(responseRaza.message);
      return;
    }

    successTemporal(responseRaza.message);

    addRaza(especie_id, responseRaza.data);

    esModal ? cerrarModal("create-breed") : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-register-breed", esModal);
};
