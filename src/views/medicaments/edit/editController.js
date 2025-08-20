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
import { crearCartaMedicamento } from "../medicamentsController";
import { asignarDatosMedicamentoInfo } from "../profile/profileController";

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

  const { id } = parametros;

  console.log(id);

  const info = await get("medicamentos/info/" + id);

  const contPerfil = document.querySelector(
    "[data-modal='profile-medicament-info']"
  );

  asignarDatosMedicamentoInfoEditar(info.data);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await put("medicamentos/info/" + id, datos);

    if (!response.success) {
      await error(response.message);
      return;
    }

    const contenedor = document.querySelector("#medicaments-info");
    contenedor.innerHTML = "";

    const responseAll = await get("medicamentos/info");

    responseAll.data.forEach((medicamento) => {
      const carta = crearCartaMedicamento(medicamento);
      contenedor.appendChild(carta);
    });

    await successTemporal(response.message);

    const responseMedi = await get(`medicamentos/info/${response.data.id}`);

    if (contPerfil) asignarDatosMedicamentoInfo(responseMedi.data);

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
