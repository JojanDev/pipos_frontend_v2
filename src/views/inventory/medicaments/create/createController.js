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
  capitalizarPrimeraLetra,
  agregarError,
  quitarError,
  formatearPrecioConPuntos,
} from "../../../../helpers";
import { routes } from "../../../../router/routes";
import { validarFechaCaducidad } from "../../products/create/createController";

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
  const inputFecha = document.querySelector("[name='fecha_caducidad']");

  inputFecha.addEventListener("blur", (e) => {
    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  inputFecha.addEventListener("input", (e) => {
    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid) return;
    console.log(datos);

    const response = await post("medicamentos", datos);

    console.log(response);

    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);
    console.log(response);

    const tbody = document.querySelector("#medicaments .table__body");

    if (tbody) {
      const { id, info, precio, cantidad, numero_lote } = response.data;
      const filaNueva = [
        id,
        numero_lote,
        info.nombre,
        info.uso_general,
        capitalizarPrimeraLetra(info.via_administracion),
        capitalizarPrimeraLetra(info.presentacion),
        formatearPrecioConPuntos(precio),
        cantidad,
      ];
      const row = crearFila(filaNueva);
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
      await cargarComponente(routes.medicamentos_info.crear);
    }
  });
};
