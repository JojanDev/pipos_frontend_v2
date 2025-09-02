import {
  error,
  successTemporal,
  post,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  capitalizarPrimeraLetra,
  configurarBotonCerrar,
  DOMSelectorAll,
  DOMSelector,
} from "../../../helpers";
import { crearCartaMedicamento } from "../medicamentsController";

export const createMedicamentInfoController = async () => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  if (data.id_rol != 1) {
    const opcionesAdmin = DOMSelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }

  const form = DOMSelector("#form-register-medicament-info");
  // const selectTipoDocumento = DOMSelector("#tipos-documento");
  const tbody = DOMSelector("#medicament-infos .table__body");
  const esModal = !location.hash.includes("medicamentos_info/crear");

  const optionMedicamentosInfo = DOMSelector(
    "#form-register-medicament-inventory #select-medicamentos-info #option-placeholder"
  );

  const selectMedicamentosInfo = DOMSelector(
    "#form-register-medicament-inventory #select-medicamentos-info"
  );

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await post("info-medicamentos", datos);

    if (!response.success) {
      await error(response.message);
      return;
    }

    successTemporal(response.message);

    const contenedor = DOMSelector("#medicaments-info");

    if (contenedor) {
      const carta = crearCartaMedicamento(response.data);
      contenedor.insertAdjacentElement("afterbegin", carta);
    }

    if (optionMedicamentosInfo) {
      const option = document.createElement("option");
      option.value = response.data.id;
      option.textContent = `${response.data.nombre} (${capitalizarPrimeraLetra(
        response.data.presentacion
      )} - ${capitalizarPrimeraLetra(response.data.via_administracion)})`;
      optionMedicamentosInfo.insertAdjacentElement("afterend", option);
      selectMedicamentosInfo.value = response.data.id;
    }

    esModal
      ? cerrarModal("create-medicament-info")
      : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-register-medicament-info", esModal);
};
