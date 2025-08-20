import {
  capitalizarPrimeraLetra,
  cerrarModal,
  configurarEventosValidaciones,
  crearElementoTratamiento,
  crearFila,
  datos,
  error,
  get,
  llenarSelect,
  post,
  put,
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

function convertirDias(diasTotales) {
  const meses = Math.floor(diasTotales / 30) || null;
  const diasRestantesMeses = diasTotales % 30;

  const semanas = Math.floor(diasRestantesMeses / 7) || null;
  const dias = diasRestantesMeses % 7 || null;

  return {
    meses,
    semanas,
    dias,
  };
}

export const editMedicamentTreatmentController = async (parametros = null) => {
  const { id } = parametros;
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  if (data.id_rol != 1) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }

  const responseMediTrat = await get("medicamentos/tratamiento/item/" + id);

  console.log(responseMediTrat);

  await llenarSelect({
    endpoint: "medicamentos/info/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id: id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

  document.querySelector("#select-medicamentos-info").value =
    responseMediTrat.data.id_medicamento_info;
  document.querySelector("#dosis").value = responseMediTrat.data.dosis;
  document.querySelector("#frecuencia_aplicacion").value =
    responseMediTrat.data.frecuencia_aplicacion;

  const { meses, semanas, dias } = convertirDias(
    responseMediTrat.data.duracion
  );

  document.querySelector("#meses").value = meses;
  document.querySelector("#semanas").value = semanas;
  document.querySelector("#dias").value = dias;

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

    const responseMedicamentoTratamiento = await put(
      "medicamentos/tratamiento/" + id,
      {
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
      const responseMedicamentos = await get(
        `medicamentos/tratamiento/${responseMedicamentoTratamiento.data.id_tratamiento}`
      );

      if (responseMedicamentos.success) {
        tbody.innerHTML = "";
        responseMedicamentos.data.forEach((medicamentoTratamiento) => {
          const {
            id,
            medicamento,
            dosis,
            duracionFormateada,
            frecuencia_aplicacion,
          } = medicamentoTratamiento;

          const iconDelete = document.createElement("i");

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
            data.id_rol == 1 ? iconDelete : "",
            iconEdit,
          ]);

          tbody.append(row);
        });
      }
    }

    await success(responseMedicamentoTratamiento.message);

    esModal
      ? cerrarModal("edit-pet-antecedent-treatment-medicament")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector(
    "#back-edit-pet-antecedent-treatment-medicament"
  );

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("edit-pet-antecedent-treatment-medicament")
      : cerrarModalYVolverAVistaBase();
  });
};
