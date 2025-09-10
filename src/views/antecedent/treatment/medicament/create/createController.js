// Helpers
import {
  capitalizarPrimeraLetra,
  cerrarModal,
  configurarEventosValidaciones,
  convertirDias,
  crearFila,
  datos,
  DOMSelector,
  error,
  get,
  llenarSelect,
  post,
  renderNotFound,
  successTemporal,
  validarCampos,
} from "../../../../../helpers";

/**
 * Calcula los días totales a partir de meses, semanas y días.
 *
 * @param {Object} duracion - Valores de duración.
 * @param {number} duracion.meses - Cantidad de meses.
 * @param {number} duracion.semanas - Cantidad de semanas.
 * @param {number} duracion.dias - Cantidad de días.
 * @returns {number} - Total de días redondeado hacia abajo.
 */
const calcularDiasTotales = ({ meses = 0, semanas = 0, dias = 0 }) => {
  const diasPorMes = 30.4375;
  const diasPorSemana = 7;
  const total =
    meses * diasPorMes + semanas * diasPorSemana + parseInt(dias, 10);
  return Math.floor(total);
};

/**
 * Controlador para crear un medicamento en un tratamiento asociado a un antecedente de mascota.
 * Realiza validaciones, envía los datos al backend y actualiza la tabla de medicamentos.
 *
 * @param {Object|null} parametros - Parámetros de configuración del controlador.
 * @param {Object} parametros.perfil - Tratamiento al que se agregará el medicamento.
 * @param {Object} parametros.antecedente - Antecedente relacionado al tratamiento.
 * @returns {Promise<void>} - No retorna nada; actualiza el DOM y controla modales.
 *
 */
export const createMedicamentController = async (parametros = null) => {
  // Depuración: mostramos parámetros recibidos
  console.log(parametros);

  // Extraemos tratamiento y antecedente de los parámetros
  const { perfil: tratamiento, antecedente } = parametros;

  // Verificamos estado vital de la mascota asociada al antecedente
  const antecedenteResp = await get(`antecedentes/${antecedente.id}`);
  const mascotaResp = await get(`mascotas/${antecedenteResp.data.mascota_id}`);
  if (!mascotaResp.data.estado_vital) {
    await renderNotFound();
    return;
  }

  // Cargamos opciones en el select de medicamentos
  llenarSelect({
    endpoint: "info-medicamentos/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

  // Seleccionamos el formulario y configuramos validaciones
  const form = DOMSelector(
    "#form-register-pet-antecedent-treatment-medicament"
  );
  configurarEventosValidaciones(form);

  // Manejo del envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validamos campos básicos
    if (!validarCampos(e)) return;

    // Verificamos que al menos un campo de duración esté completo
    const inputMeses = DOMSelector('[name="meses"]');
    const inputSemanas = DOMSelector('[name="semanas"]');
    const inputDias = DOMSelector('[name="dias"]');
    if (!inputMeses.value && !inputSemanas.value && !inputDias.value) {
      error("Ingrese al menos un valor en la sección de Duración");
      return;
    }

    // Preparamos datos para la petición POST
    datos.antecedente_id = antecedente.id;
    const medData = {
      tratamiento_id: tratamiento.id,
      info_medicamento_id: datos.info_medicamento_id,
      frecuencia_aplicacion: datos.frecuencia_aplicacion,
      duracion: calcularDiasTotales(datos),
      dosis: datos.dosis,
    };

    // Creamos la relación medicamento-tratamiento
    const medResp = await post("medicamentos-tratamientos/", medData);
    if (!medResp.success) {
      await error(medResp.message);
      return;
    }

    // Insertamos la nueva fila en la tabla de medicamentos
    const tbody = DOMSelector("#pet-antecedent-treatment .table__body");
    if (tbody) {
      const {
        id,
        info_medicamento_id,
        dosis,
        frecuencia_aplicacion,
        duracion,
      } = medResp.data;
      const { data: medInfo } = await get(
        `info-medicamentos/${info_medicamento_id}`
      );

      // Creamos iconos de acción para la fila
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

      // Construimos y añadimos la fila
      const row = crearFila([
        id,
        medInfo.nombre,
        medInfo.uso_general,
        capitalizarPrimeraLetra(medInfo.via_administracion),
        dosis,
        frecuencia_aplicacion,
        convertirDias(duracion),
        iconDelete,
        iconEdit,
      ]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    // Mensaje de éxito y cierre del modal
    successTemporal(medResp.message);
    cerrarModal("create-pet-antecedent-treatment-medicament");
    history.back();
  });

  // Cierre del modal al hacer clic fuera del formulario
  const contenedorVista = DOMSelector(
    '[data-modal="create-pet-antecedent-treatment-medicament"]'
  );
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id === "back-register-pet-antecedent-treatment-medicament") {
      cerrarModal("create-pet-antecedent-treatment-medicament");
      history.back();
    }
  });
};
