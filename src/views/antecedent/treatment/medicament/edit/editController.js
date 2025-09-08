import {
  capitalizarPrimeraLetra,
  cerrarModal,
  configurarBotonCerrar,
  configurarEventosValidaciones,
  crearElementoTratamiento,
  crearFila,
  datos,
  DOMSelector,
  DOMSelectorAll,
  error,
  get,
  llenarSelect,
  mapearDatosEnContenedor,
  post,
  put,
  renderNotFound,
  success,
  successTemporal,
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
  console.log(parametros);

  // const { id } = parametros;
  const { editar: medicamentoTratamiento, antecedente } = parametros;
  const getAntecedente = await get(`antecedentes/${antecedente.id}`);
  const getMascota = await get(`mascotas/${getAntecedente.data.mascota_id}`);

  if (!getMascota.data.estado_vital) return await renderNotFound();

  const responseMediTrat = await get(
    `medicamentos-tratamientos/${medicamentoTratamiento.id}`
  );
  const a = await get(`info-medicamentos/`);
  console.log(a);

  console.log(responseMediTrat);

  await llenarSelect({
    endpoint: "info-medicamentos/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id: id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

  const { meses, semanas, dias } = convertirDias(
    responseMediTrat.data.duracion
  );

  const form = DOMSelector(
    "#form-register-pet-antecedent-treatment-medicament"
  );

  mapearDatosEnContenedor(
    {
      ...responseMediTrat.data,
      "select-medicamentos-info": responseMediTrat.data.info_medicamento_id,
      meses,
      semanas,
      dias,
    },
    form
  );

  const esModal = !location.hash.includes("antecedente/tratamientoCrear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputMeses = DOMSelector('[name="meses"]');
    const inputSemanas = DOMSelector('[name="semanas"]');
    const inputDias = DOMSelector('[name="dias"]');
    if (!validarCampos(e)) return;

    if (
      inputMeses.value == "" &&
      inputSemanas.value == "" &&
      inputDias.value == ""
    ) {
      error("Ingrese al menos un valor en la seccion de Duracion");
      return;
    }

    const { info_medicamento_id, frecuencia_aplicacion, dosis } = datos;
    const duracion = calcularDiasTotales(datos);

    const responseMedicamentoTratamiento = await put(
      `medicamentos-tratamientos/${medicamentoTratamiento.id}`,
      {
        info_medicamento_id,
        frecuencia_aplicacion,
        duracion,
        dosis,
        tratamiento_id: responseMediTrat.data.tratamiento_id,
      }
    );

    console.log(responseMedicamentoTratamiento);

    if (!responseMedicamentoTratamiento.success)
      return await error(responseMedicamentoTratamiento.message);

    const tbody = DOMSelector("#pet-antecedent-treatment .table__body");

    const oldRow = DOMSelector(
      `#pet-antecedent-treatment [data-id='${medicamentoTratamiento.id}'`
    );
    console.log(oldRow);

    if (tbody) {
      // tbody.innerHTML = "";
      const { id, dosis, duracion, frecuencia_aplicacion } =
        responseMedicamentoTratamiento.data;

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

      const { data: infoMedicamento } = await get(
        `info-medicamentos/${info_medicamento_id}`
      );

      const updatedRow = crearFila([
        id,
        infoMedicamento.nombre,
        infoMedicamento.uso_general,
        capitalizarPrimeraLetra(infoMedicamento.via_administracion),
        dosis,
        frecuencia_aplicacion,
        duracion,
        iconDelete,
        iconEdit,
      ]);

      tbody.replaceChild(updatedRow, oldRow);
    }

    successTemporal(responseMedicamentoTratamiento.message);

    esModal
      ? cerrarModal("edit-pet-antecedent-treatment-medicament")
      : cerrarModalYVolverAVistaBase();
  });

  const contenedorVista = DOMSelector(
    `[data-modal="edit-pet-antecedent-treatment-medicament"]`
  );

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-pet-antecedent-treatment-medicament") {
      cerrarModal("edit-pet-antecedent-treatment-medicament");
      history.back();
    }
  });
};
