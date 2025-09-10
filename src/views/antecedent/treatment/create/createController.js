// Helpers
import {
  get,
  post,
  crearElementoTratamiento,
  llenarSelectVeterinarios,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  successTemporal,
  errorTemporal,
  cerrarModal,
  renderNotFound,
} from "../../../../helpers";

/**
 * Controlador para crear un tratamiento asociado a un antecedente de mascota.
 * Valida estado de la mascota, configura el formulario, envía datos al backend
 * y actualiza el DOM con el nuevo tratamiento.
 *
 * @param {Object|null} parametros - Parámetros de configuración.
 * @param {Object} parametros.antecedente - Antecedente al que pertenece el tratamiento.
 * @param {Object} parametros.perfil - Perfil de la mascota correspondiente.
 * @returns {Promise<void>} - No retorna nada; maneja modales, validaciones y DOM.
 *
 */
export const createTreatmentController = async (parametros = null) => {
  // Depuración: mostramos parámetros recibidos
  console.log(parametros);

  // Extraemos antecedente y mascota de los parámetros
  const { antecedente, perfil: mascota } = parametros;

  // Verificamos estado vital de la mascota; si está fallecida, mostramos 'not found'
  const mascotaResp = await get(`mascotas/${mascota.id}`);
  if (!mascotaResp.data.estado_vital) {
    await renderNotFound();
    return;
  }

  // Seleccionamos el formulario de creación de tratamiento
  const form = document.querySelector(
    "#form-register-pet-antecedent-treatment"
  );

  // Cargamos la lista de veterinarios en el select correspondiente
  await llenarSelectVeterinarios();

  // Configuramos validaciones en el formulario
  configurarEventosValidaciones(form);

  // Manejo del evento submit para enviar datos de tratamiento
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validamos campos antes de procesar el envío
    if (!validarCampos(e)) return;

    // Asociamos el antecedente al objeto de datos a enviar
    datos.antecedente_id = antecedente.id;

    // Enviamos la petición para crear el tratamiento
    const treatmentResp = await post("tratamientos", datos);
    if (!treatmentResp.success) {
      // Mostramos mensaje de error temporal y salimos
      errorTemporal(treatmentResp.message);
      return;
    }

    // Creamos el elemento DOM del nuevo tratamiento
    const nuevoTratamientoEl = crearElementoTratamiento(treatmentResp.data);

    // Buscamos el contenedor del antecedente para insertar el tratamiento
    const antecedenteContainer = document.querySelector(
      `[data-idAntecendente="${antecedente.id}"]`
    );
    const body = antecedenteContainer?.querySelector(".antecedente-body");

    // Eliminamos mensaje de 'sin tratamientos' si existe
    const placeholder = body?.querySelector(".mensaje-sin-tratamientos");
    if (placeholder) placeholder.remove();

    // Insertamos el nuevo tratamiento después del separador
    const separador = body?.querySelector(".perfil__separador--treatment");
    if (separador) {
      separador.insertAdjacentElement("afterend", nuevoTratamientoEl);
    }

    // Mostramos mensaje de éxito temporal
    successTemporal(treatmentResp.message);

    // Cerramos modal y navegamos en el historial
    cerrarModal("create-pet-antecedent-treatment");
    history.back();
  });

  // Botón para cerrar modal y regresar al historial
  const btnBack = document.querySelector(
    "#back-register-pet-antecedent-treatment"
  );
  btnBack.addEventListener("click", () => {
    cerrarModal("create-pet-antecedent-treatment");
    history.back();
  });
};
