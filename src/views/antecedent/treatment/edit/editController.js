// Helpers
import {
  error,
  get,
  put,
  cerrarModal,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelectVeterinarios,
  DOMSelector,
  mapearDatosEnContenedor,
  successTemporal,
  renderNotFound,
} from "../../../../helpers";

/**
 * Controlador para editar un tratamiento asociado a un antecedente de mascota.
 * Recupera datos previos, rellena el formulario, verifica estado vital de la mascota,
 * envía la actualización al backend y actualiza la vista del modal.
 *
 * @param {Object|null} parametros - Parámetros de configuración del controlador.
 * @param {Object} parametros.perfil - Objeto tratamiento con datos iniciales.
 * @param {Object} parametros.antecedente - Objeto antecedente al que pertenece el tratamiento.
 * @returns {Promise<void>} - No retorna nada; modifica el DOM, realiza peticiones HTTP y controla modales.
 *
 */
export const editTreatmentController = async (parametros = null) => {
  // Depuración: mostramos parámetros recibidos
  console.log(parametros);

  // Extraemos tratamiento y antecedente de los parámetros
  const { perfil: tratamiento, antecedente } = parametros;

  // Obtenemos antecedente para determinar mascota asociada
  const antecedenteResp = await get(`antecedentes/${antecedente.id}`);
  // Verificamos estado vital de la mascota
  const mascotaResp = await get(`mascotas/${antecedenteResp.data.mascota_id}`);
  if (!mascotaResp.data.estado_vital) {
    // Si la mascota está fallecida, mostramos pantalla de 'not found'
    await renderNotFound();
    return;
  }

  // Referencia al formulario dentro del modal de edición
  const form = DOMSelector("#form-register-pet-antecedent-treatment");
  // Referencia al contenedor del modal para actualizar luego los datos mapeados
  const contenedorModal = DOMSelector('[data-modal="pet-treatment"]');

  // Cargamos la lista de veterinarios en el select correspondiente
  await llenarSelectVeterinarios();

  // Obtenemos datos actuales del tratamiento
  const tratamientoResp = await get(`tratamientos/${tratamiento.id}`);

  // Rellenamos el formulario con los datos del tratamiento y seleccionamos veterinario
  mapearDatosEnContenedor(
    {
      ...tratamientoResp.data,
      "select-veterinarios": tratamientoResp.data.usuario_id,
    },
    form
  );

  // Preparamos validaciones en el formulario
  configurarEventosValidaciones(form);

  // Manejo del envío del formulario para actualizar tratamiento
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitamos acción por defecto

    // Validamos campos antes de enviar
    if (!validarCampos(e)) return;

    // Enviamos la actualización al backend
    const updateResp = await put(`tratamientos/${tratamiento.id}`, {
      ...datos,
      antecedente_id: tratamientoResp.data.antecedente_id,
    });
    if (!updateResp.success) {
      // Mostramos error si falla la actualización
      await error(updateResp.message);
      return;
    }

    // Obtenemos datos del veterinario asociado al tratamiento actualizado
    const vetResp = await get(`usuarios/${updateResp.data.usuario_id}`);

    // Actualizamos el contenido del modal con los nuevos datos
    mapearDatosEnContenedor(
      {
        ...updateResp.data,
        veterinario: vetResp.data.nombre,
      },
      contenedorModal
    );

    // Mensaje temporal de éxito y cierre de modal
    successTemporal(updateResp.message);
    cerrarModal("edit-pet-antecedent-treatment");
    history.back(); // Regresamos en el historial del navegador
  });

  // Botón de volver: cierra modal y regresa en historial
  const btnBack = DOMSelector("#back-edit-pet-antecedent-treatment");
  btnBack.addEventListener("click", () => {
    cerrarModal("edit-pet-antecedent-treatment");
    history.back();
  });
};
