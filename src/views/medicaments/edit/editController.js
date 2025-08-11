import {
  error,
  successTemporal,
  post,
  cargarTiposDocumento,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  capitalizarPrimeraLetra,
  get,
  put,
} from "../../../helpers";
import { listarMedicamentos } from "../../inventory/inventoryController";
import { asignarDatosMedicamentoInfo } from "../../inventory/medicaments/profile/profileController";

const asignarDatosMedicamentoInfoEditar = (data) => {
  const inputNombre = document.querySelector('[name="nombre"]');
  const inputUsoGeneral = document.querySelector('[name="uso_general"]');
  const inputVia = document.querySelector('[name="via_administracion"]');
  const inputPresentacion = document.querySelector('[name="presentacion"]');
  const textareaAdicional = document.querySelector(
    '[name="informacion_adicional"]'
  );

  const {
    nombre,
    uso_general,
    via_administracion,
    presentacion,
    informacion_adicional,
  } = data;

  inputNombre.value = nombre || "";
  inputUsoGeneral.value = uso_general || "";
  inputVia.value = via_administracion || "";
  inputPresentacion.value = presentacion || "";
  textareaAdicional.value = informacion_adicional || "";
};

export const editMedicamentInfoController = async (parametros = null) => {
  const form = document.querySelector("#form-edit-medicament-info");
  // const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#medicament-infos .table__body");
  const esModal = !location.hash.includes("medicamentos_info/editar");

  // await cargarTiposDocumento(selectTipoDocumento);

  const { idInfo, idMedicamento } = parametros;

  console.log("idMedicamento", idMedicamento);

  const info = await get("medicamentos/info/" + idInfo);

  const contenedorPerfilMedicamento = document.querySelector(
    "[data-modal='profile-medicament']"
  );
  asignarDatosMedicamentoInfoEditar(info.data);

  const contenedorTablaMedicamentos = document.querySelector("#medicaments");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const response = await put("medicamentos/info/" + idInfo, datos);

    console.log(response);

    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);
    console.log(response);

    const responseMedi = await get(`medicamentos/${idMedicamento}`);
    console.log(responseMedi);

    if (contenedorPerfilMedicamento)
      asignarDatosMedicamentoInfo(responseMedi.data.info);

    console.log(contenedorTablaMedicamentos);

    if (contenedorTablaMedicamentos) listarMedicamentos();

    esModal
      ? cerrarModal("edit-medicament-info")
      : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-edit-medicament-info");
    if (arrow) {
      esModal
        ? cerrarModal("edit-medicament-info")
        : cerrarModalYVolverAVistaBase();
    }
  });
};
