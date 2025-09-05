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
  get,
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

export const editBreedController = async (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="edit-breed"]`);
  // Id de la especie
  // const { id, nombre, especie_id } = parametros;
  const { perfil: raza } = parametros;

  const form = DOMSelector("#form-edit-breed");
  const esModal = !location.hash.includes("razasEditar");

  const titulo = DOMSelector("#nombreRaza");

  const getRaza = await get(`razas/${raza.id}`);
  titulo.value = getRaza.data.nombre;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;
    if (getRaza.data.nombre == datos.nombre) {
      cerrarModal("edit-breed");
      history.back();
      return;
    }

    const responseEspecie = await put(`razas/${raza.id}`, {
      ...datos,
      especie_id: getRaza.data.especie_id,
    });

    if (!responseEspecie.success) return await error(responseEspecie.message);

    successTemporal(responseEspecie.message);

    updateRaza(getRaza.data.especie_id, responseEspecie.data);

    const titulo = DOMSelector("#breed-title");

    titulo.textContent = responseEspecie.data.nombre;

    cerrarModal("edit-breed");
    history.back();
  });

  // configurarBotonCerrar("back-edit-breed", esModal);

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-breed") {
      cerrarModal("edit-breed");
      history.back();
    }
  });
};
