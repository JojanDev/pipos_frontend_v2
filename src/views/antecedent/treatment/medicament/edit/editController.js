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
  mapearDatosEnContenedor,
  put,
  renderNotFound,
  successTemporal,
  validarCampos,
} from "../../../../../helpers";
import { calcularDiasTotales } from "../create/createController";

/**
 * Convierte duración total en meses, semanas y días.
 *
 * @param {number} diasTotales - Número total de días.
 * @returns {Object} - Objeto con {meses, semanas, dias}.
 */
const convertirDiasMapeador = (diasTotales) => {
  // Calculamos meses enteros a partir del total de días
  const meses = Math.floor(diasTotales / 30) || null;
  const diasRestantesMeses = diasTotales % 30;

  // Calculamos semanas enteras de los días restantes
  const semanas = Math.floor(diasRestantesMeses / 7) || null;

  // Días sobrantes después de extraer meses y semanas
  const dias = diasRestantesMeses % 7 || null;

  return { meses, semanas, dias };
};

/**
 * Controlador para editar un medicamento en un tratamiento de un antecedente de mascota.
 * Carga datos actuales, permite la edición y reemplaza la fila correspondiente en la tabla.
 *
 * @param {Object|null} parametros - Parámetros de configuración del controlador.
 * @param {Object} parametros.editar - Datos del medicamento-tratamiento a editar.
 * @param {Object} parametros.antecedente - Datos del antecedente relacionado.
 * @returns {Promise<void>} - No retorna nada; realiza peticiones HTTP, actualiza el DOM y cierra modales.
 *
 */
export const editMedicamentTreatmentController = async (parametros = null) => {
  // Extraemos medicamento-tratamiento y antecedente de los parámetros
  const { editar: medicamentoTratamiento, antecedente } = parametros;

  // Obtenemos antecedente para saber la mascota asociada
  const antecedenteResp = await get(`antecedentes/${antecedente.id}`);

  // Verificamos que la mascota esté viva
  const mascotaResp = await get(`mascotas/${antecedenteResp.data.mascota_id}`);
  if (!mascotaResp.data.estado_vital) {
    await renderNotFound();
    return;
  }

  // Obtenemos datos actuales del registro medicamento-tratamiento
  const mediTratResp = await get(
    `medicamentos-tratamientos/${medicamentoTratamiento.id}`
  );

  // Cargamos opciones en el select de info-medicamentos
  await llenarSelect({
    endpoint: "info-medicamentos/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

  // Convertimos la duración total en meses, semanas y días para el formulario
  const { meses, semanas, dias } = convertirDiasMapeador(
    mediTratResp.data.duracion
  );

  // Referencia al formulario de edición y relleno con datos actuales
  const form = DOMSelector(
    "#form-register-pet-antecedent-treatment-medicament"
  );
  mapearDatosEnContenedor(
    {
      ...mediTratResp.data,
      "select-medicamentos-info": mediTratResp.data.info_medicamento_id,
      meses,
      semanas,
      dias,
    },
    form
  );

  // Configuramos validaciones del formulario
  configurarEventosValidaciones(form);

  // Manejo del envío para actualizar el medicamento-tratamiento
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validamos campos antes de enviar
    if (!validarCampos(e)) return;

    // Verificamos que haya al menos un valor de duración ingresado
    const inputMeses = DOMSelector('[name="meses"]');
    const inputSemanas = DOMSelector('[name="semanas"]');
    const inputDias = DOMSelector('[name="dias"]');
    if (!inputMeses.value && !inputSemanas.value && !inputDias.value) {
      error("Ingrese al menos un valor en la sección de Duración");
      return;
    }

    // Preparamos datos para la petición PUT
    const { info_medicamento_id, frecuencia_aplicacion, dosis } = datos;
    const duracionTotal = calcularDiasTotales(datos);
    const updateResp = await put(
      `medicamentos-tratamientos/${medicamentoTratamiento.id}`,
      {
        info_medicamento_id,
        frecuencia_aplicacion,
        duracion: duracionTotal,
        dosis,
        tratamiento_id: mediTratResp.data.tratamiento_id,
      }
    );

    // Si falla la actualización, mostramos error y salimos
    if (!updateResp.success) {
      await error(updateResp.message);
      return;
    }

    // Reemplazamos la fila antigua por la actualizada en la tabla del modal
    const tbody = DOMSelector("#pet-antecedent-treatment .table__body");
    const oldRow = DOMSelector(`[data-id='${medicamentoTratamiento.id}']`);
    if (tbody && oldRow) {
      // Obtenemos datos del medicamento para mostrar texto en la fila
      const { data: medInfo } = await get(
        `info-medicamentos/${info_medicamento_id}`
      );

      // Creamos los iconos de acción para la nueva fila
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

      // Construimos la nueva fila con los datos actualizados
      const {
        id,
        dosis: dose,
        frecuencia_aplicacion: freq,
        duracion: dur,
      } = updateResp.data;
      const newRow = crearFila([
        id,
        medInfo.nombre,
        medInfo.uso_general,
        capitalizarPrimeraLetra(medInfo.via_administracion),
        dose,
        freq,
        convertirDias(dur),
        iconDelete,
        iconEdit,
      ]);

      tbody.replaceChild(newRow, oldRow);
    }

    // Mostramos mensaje de éxito y cerramos el modal
    successTemporal(updateResp.message);
    cerrarModal("edit-pet-antecedent-treatment-medicament");
    history.back();
  });

  // Botón para cerrar modal y regresar en el historial
  const contenedorModal = DOMSelector(
    '[data-modal="edit-pet-antecedent-treatment-medicament"]'
  );
  contenedorModal.addEventListener("click", (e) => {
    if (e.target.id === "back-edit-pet-antecedent-treatment-medicament") {
      cerrarModal("edit-pet-antecedent-treatment-medicament");
      history.back();
    }
  });
};
