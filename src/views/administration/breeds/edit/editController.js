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
  put,
  DOMSelector,
  configurarBotonCerrar,
  successTemporal,
} from "../../../../helpers";
import {
  especiesConRazas,
  listarEspecies,
} from "../../administrationController";

const updateRaza = (idEspecie, razaActualizada) => {
  const especie = especiesConRazas.find((e) => e.id == idEspecie);
  if (!especie) return;

  const raza = especie.razas.find((r) => r.id == razaActualizada.id);
  raza.nombre = razaActualizada.nombre;

  // 2. si está seleccionada en el DOM, actualizar la tabla
  const especieSeleccionada = DOMSelector(".table__row--selected");
  if (especieSeleccionada?.children[0]?.textContent.trim() == idEspecie) {
    const razasTbody = DOMSelector("#breeds .table__body");

    const oldRow = razasTbody.querySelector(
      `[data-id='${razaActualizada.id}']`
    );
    const nombreRaza = oldRow.children[1];
    nombreRaza.textContent = razaActualizada.nombre;
  }
};

export const editBreedController = (parametros = null) => {
  // Id de la especie
  const { id, nombre, especie_id } = parametros;

  const form = DOMSelector("#form-edit-breed");
  const esModal = !location.hash.includes("razasEditar");

  const titulo = DOMSelector("#nombreRaza");

  titulo.value = nombre;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;
    if (nombre == datos.nombre) {
      esModal ? cerrarModal("edit-breed") : cerrarModalYVolverAVistaBase();

      return;
    }

    const responseEspecie = await put(`razas/${id}`, { ...datos, especie_id });

    if (!responseEspecie.success) return await error(responseEspecie.message);

    successTemporal(responseEspecie.message);

    updateRaza(especie_id, responseEspecie.data);

    const titulo = DOMSelector("#breed-title");

    titulo.textContent = responseEspecie.data.nombre;

    esModal ? cerrarModal("edit-breed") : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-edit-breed", esModal);
};
