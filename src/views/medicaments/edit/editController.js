import {
  error,
  successTemporal,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  get,
  put,
  DOMSelector,
  mapearDatosEnContenedor,
  configurarBotonCerrar,
} from "../../../helpers";
import { crearCartaMedicamento } from "../medicamentsController";

export const editMedicamentInfoController = async (parametros = null) => {
  const form = DOMSelector("#form-edit-medicament-info");

  const esModal = !location.hash.includes("medicamentos_info/editar");

  const { id } = parametros;

  console.log(id);

  const info = await get(`info-medicamentos/${id}`);

  const contPerfil = DOMSelector("[data-modal='profile-medicament-info']");

  mapearDatosEnContenedor(info.data, form);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await put(`info-medicamentos/${id}`, datos);

    if (!response.success) {
      await error(response.message);
      return;
    }

    const contenedor = DOMSelector("#medicaments-info");

    const oldRow = contenedor.querySelector(`[data-id='${id}']`);

    const updatedRow = crearCartaMedicamento(response.data);

    contenedor.replaceChild(updatedRow, oldRow);

    mapearDatosEnContenedor(response.data, contPerfil);

    successTemporal(response.message);

    esModal
      ? cerrarModal("edit-medicament-info")
      : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-edit-medicament-info", esModal);
};
