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
} from "../../../helpers";
import { crearCartaMedicamento } from "../medicamentsController";

export const createMedicamentInfoController = async () => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  if (data.id_rol != 1) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }

  const form = document.querySelector("#form-register-medicament-info");
  // const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#medicament-infos .table__body");
  const esModal = !location.hash.includes("medicamentos_info/crear");

  const optionMedicamentosInfo = document.querySelector(
    "#form-register-medicament-inventory #select-medicamentos-info #option-placeholder"
  );

  const selectMedicamentosInfo = document.querySelector(
    "#form-register-medicament-inventory #select-medicamentos-info"
  );

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await post("medicamentos/info", datos);

    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);

    const contenedor = document.querySelector("#medicaments-info");

    if (contenedor) {
      const carta = crearCartaMedicamento(response.data);
      contenedor.insertAdjacentElement("afterbegin", carta);
    }

    // const {
    //   id,
    //   info: { nombre, telefono, numeroDocumento, direccion },
    // } = response.data;

    // if (tbody) {

    //   const row = crearFila([id, nombre, telefono, numeroDocumento, direccion]);
    //   tbody.insertAdjacentElement("afterbegin", row);
    // }
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

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-medicament-info");
    if (arrow) {
      esModal
        ? cerrarModal("create-medicament-info")
        : cerrarModalYVolverAVistaBase();
    }
  });
};
