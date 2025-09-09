import {
  capitalizarPrimeraLetra,
  cerrarModal,
  configurarBotonCerrar,
  configurarEventosValidaciones,
  convertirDias,
  crearElementoTratamiento,
  crearFila,
  datos,
  DOMSelector,
  error,
  get,
  llenarSelect,
  post,
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

export const createMedicamentController = async (parametros = null) => {
  console.log(parametros);
  const { perfil: tratamiento, antecedente } = parametros;
  const getAntecedente = await get(`antecedentes/${antecedente.id}`);
  const getMascota = await get(`mascotas/${getAntecedente.data.mascota_id}`);

  if (!getMascota.data.estado_vital) return await renderNotFound();
  // const { idTratamiento } = parametros;

  llenarSelect({
    endpoint: "info-medicamentos/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id: id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

  const form = DOMSelector(
    "#form-register-pet-antecedent-treatment-medicament"
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

    const responseMedicamentoTratamiento = await post(
      "medicamentos-tratamientos/",
      {
        tratamiento_id: tratamiento.id,
        info_medicamento_id,
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

    const tbody = DOMSelector("#pet-antecedent-treatment .table__body");

    if (tbody) {
      const {
        id,
        info_medicamento_id,
        dosis,
        frecuencia_aplicacion,
        duracion,
      } = responseMedicamentoTratamiento.data;

      const { data: infoMedicamento } = await get(
        `info-medicamentos/${info_medicamento_id}`
      );

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
        infoMedicamento.nombre,
        infoMedicamento.uso_general,
        capitalizarPrimeraLetra(infoMedicamento.via_administracion),
        dosis,
        frecuencia_aplicacion,
        convertirDias(duracion),
        iconDelete,
        iconEdit,
      ]);

      tbody.insertAdjacentElement("afterbegin", row);
    }

    successTemporal(responseMedicamentoTratamiento.message);

    cerrarModal("create-pet-antecedent-treatment-medicament");
    history.back();
  });

  configurarBotonCerrar(
    "back-register-pet-antecedent-treatment-medicament",
    esModal
  );
  const contenedorVista = DOMSelector(
    `[data-modal="create-pet-antecedent-treatment-medicament"]`
  );

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-register-pet-antecedent-treatment-medicament") {
      cerrarModal("create-pet-antecedent-treatment-medicament");
      history.back();
    }
  });
};
