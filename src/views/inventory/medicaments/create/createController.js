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
  cargarComponente,
  llenarSelect,
} from "../../../../helpers";
import { routes } from "../../../../router/routes";

export const createMedicamentInventoryController = async () => {
  llenarSelect({
    endpoint: "medicamentos/info/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id: id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

  const form = document.querySelector("#form-register-medicament-inventory");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#medicament-inventorys .table__body");
  const esModal = !location.hash.includes("inventario/medicamentosCrear");

  // await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const response = await post("medicamentos", datos);

    console.log(response);

    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);
    console.log(response);

    if (tbody) {
      const {
        id,
        info: { nombre, telefono, numeroDocumento, direccion },
      } = response.data;

      const row = crearFila([id, nombre, telefono, numeroDocumento, direccion]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    esModal
      ? cerrarModal("create-medicament-inventory")
      : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", async (event) => {
    const arrow = event.target.closest("#back-register-medicament-inventory");
    if (arrow) {
      esModal
        ? cerrarModal("create-medicament-inventory")
        : cerrarModalYVolverAVistaBase();
    }

    if (event.target.id == "register-medicament-info") {
      await cargarComponente(routes.medicamentos_info.crear, {
        id: null,
        // nombre: response.data.nombre,
      });
    }
  });
};
