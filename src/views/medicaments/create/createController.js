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
} from "../../../helpers";

export const createMedicamentInfoController = async () => {
  const form = document.querySelector("#form-register-medicament-info");
  // const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#medicament-infos .table__body");
  const esModal = !location.hash.includes("medicamentos_info/crear");

  const selectMedicamentosInfo = document.querySelector(
    "#form-register-medicament-inventory #select-medicamentos-info"
  );

  // await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const response = await post("medicamentos/info", datos);

    console.log(response);

    // if (!response.success) {
    //   await error(response.message);
    //   return;
    // }

    // await successTemporal(response.message);
    // console.log(response);

    // const {
    //   id,
    //   info: { nombre, telefono, numeroDocumento, direccion },
    // } = response.data;

    // if (tbody) {

    //   const row = crearFila([id, nombre, telefono, numeroDocumento, direccion]);
    //   tbody.insertAdjacentElement("afterbegin", row);
    // }
    // if (selectMedicamentosInfo) {
    //   const option = document.createElement("option");
    //   option.value = response.data.id;
    //   option.textContent = `${nombre} (${capitalizarPrimeraLetra(
    //     presentacion
    //   )} - ${capitalizarPrimeraLetra(via_administracion)})`;
    //   selectMedicamentosInfo.appendChild(option);
    // }

    // esModal
    //   ? cerrarModal("create-medicament-info")
    //   : cerrarModalYVolverAVistaBase();
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
