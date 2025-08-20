import {
  capitalizarPrimeraLetra,
  cerrarModal,
  configurarEventosValidaciones,
  crearElementoTratamiento,
  crearFila,
  datos,
  error,
  llenarSelect,
  post,
  success,
  validarCampos,
} from "../../../../../helpers";

const calcularDiasTotales = ({ meses = 0, semanas = 0, dias = 0 }) => {
  const diasPorMes = 30.4375;
  const diasPorSemana = 7;

  const totalDias =
    meses * diasPorMes + semanas * diasPorSemana + parseInt(dias || 0);

  return Math.floor(totalDias);
};

export const createMedicamentController = async (parametros = null) => {
  const { idTratamiento } = parametros;

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

  const form = document.querySelector(
    "#form-register-pet-antecedent-treatment-medicament"
  );

  const esModal = !location.hash.includes("antecedente/tratamientoCrear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputMeses = document.querySelector('[name="meses"]');
    const inputSemanas = document.querySelector('[name="semanas"]');
    const inputDias = document.querySelector('[name="dias"]');
    if (!validarCampos(e)) return;

    if (
      inputMeses.value == "" &&
      inputSemanas.value == "" &&
      inputDias.value == ""
    ) {
      error("Ingrese al menos un valor en la seccion de Duracion");
      return;
    }

    const { id_medicamento_info, frecuencia_aplicacion, dosis } = datos;
    const duracion = calcularDiasTotales(datos);

    const responseMedicamentoTratamiento = await post(
      "medicamentos/tratamiento",
      {
        id_tratamiento: idTratamiento,
        id_medicamento_info,
        frecuencia_aplicacion,
        duracion,
        dosis,
      }
    );

    console.log(responseMedicamentoTratamiento);

    if (!responseMedicamentoTratamiento.success) {
      await error(responseMedicamentoTratamiento.message);
      return;
    }

    const tbody = document.querySelector(
      "#pet-antecedent-treatment .table__body"
    );

    if (tbody) {
      const {
        id,
        medicamento,
        dosis,
        frecuencia_aplicacion,
        duracionFormateada,
      } = responseMedicamentoTratamiento.data;

      const iconDelete = document.createElement("i");
      // spanTitulo.textContent = titulo;
      iconDelete.classList.add(
        "ri-delete-bin-line",
        "delete-tabla",
        "btn--red",
        "admin"
      );

      const iconEdit = document.createElement("i");

      iconEdit.classList.add(
        "ri-edit-box-line",
        "edit-tabla",
        "btn--orange",
        "admin"
      );

      const row = crearFila([
        id,
        medicamento.nombre,
        medicamento.uso_general,
        capitalizarPrimeraLetra(medicamento.via_administracion),
        dosis,
        frecuencia_aplicacion,
        duracionFormateada[1],
        iconDelete,
        iconEdit,
      ]);

      tbody.insertAdjacentElement("afterbegin", row);
    }

    await success(responseMedicamentoTratamiento.message);

    esModal
      ? cerrarModal("create-pet-antecedent-treatment-medicament")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector(
    "#back-register-pet-antecedent-treatment-medicament"
  );

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("create-pet-antecedent-treatment-medicament")
      : cerrarModalYVolverAVistaBase();
  });
};
