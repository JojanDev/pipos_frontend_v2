import {
  error,
  successTemporal,
  cerrarModal,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  get,
  put,
  DOMSelector,
  mapearDatosEnContenedor,
  crearCartaMedicamento,
} from "../../../helpers";

export const editMedicamentInfoController = async (parametros = null) => {
  const form = DOMSelector("#form-edit-medicament-info");
  const contenedorVista = DOMSelector(`[data-modal="edit-medicament-info"]`);

  const esModal = !location.hash.includes("medicamentos_info/editar");

  const { perfil: infoMedicamento } = parametros;
  // const { id } = parametros;

  // console.log(id);

  const info = await get(`info-medicamentos/${infoMedicamento.id}`);

  const contPerfil = DOMSelector("[data-modal='profile-medicament-info']");

  mapearDatosEnContenedor(info.data, form);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await put(
      `info-medicamentos/${infoMedicamento.id}`,
      datos
    );

    if (!response.success) {
      await error(response.message);
      return;
    }

    const contenedor = DOMSelector("#medicaments-info");

    const oldRow = contenedor.querySelector(
      `[data-id='${infoMedicamento.id}']`
    );

    const updatedRow = crearCartaMedicamento(response.data);

    contenedor.replaceChild(updatedRow, oldRow);

    mapearDatosEnContenedor(response.data, contPerfil);

    successTemporal(response.message);

    cerrarModal("edit-medicament-info");
    history.back();
  });

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-medicament-info") {
      cerrarModal("edit-medicament-info");
      history.back();
    }
  });
};
