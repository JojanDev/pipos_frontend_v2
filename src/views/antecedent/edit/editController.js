// Helpers
import {
  error,
  get,
  put,
  llenarSelect,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  cerrarModal,
  DOMSelector,
  successTemporal,
  renderNotFound,
} from "../../../helpers";

/**
 * Controlador para editar un antecedente de mascota.
 * Recupera datos actuales, rellena el formulario de edición y maneja el envío de actualizaciones.
 *
 * @param {Object|null} parametros - Parámetros de configuración del controlador.
 * @param {Object} parametros.perfil - Perfil de la mascota a la que pertenece el antecedente.
 * @param {Object} parametros.antecedente - Datos del antecedente a editar.
 * @returns {Promise<void>} - No retorna nada; actualiza el DOM, realiza peticiones y controla modales.
 *
 */
export const editAntecedentController = async (parametros = null) => {
  // Depuración: mostramos parámetros recibidos
  console.log(parametros);

  // Extraemos mascota y antecedente de los parámetros
  const { perfil: mascota, antecedente } = parametros;

  // Verificamos estado vital de la mascota
  const mascotaData = await get(`mascotas/${mascota.id}`);
  if (!mascotaData.data.estado_vital) {
    await renderNotFound();
    return;
  }

  // Referencias al contenedor del perfil y al modal de edición
  const containerPerfil = DOMSelector(".contenedor-perfil--pet");
  const contenedorVista = DOMSelector('[data-modal="edit-pet-antecedent"]');

  // Obtenemos datos del antecedente a editar
  const antecedenteResp = await get(`antecedentes/${antecedente.id}`);

  // Rellenamos los campos del formulario con los datos actuales
  DOMSelector("#titulo-antecedente-edit").value = antecedenteResp.data.titulo;
  DOMSelector("#diagnostico-antecedente-edit").textContent =
    antecedenteResp.data.diagnostico;

  // Configuramos el select de mascotas si no estamos en perfil;
  // de lo contrario, ocultamos ese campo
  const selectPets = DOMSelector("#select-pets");
  if (!containerPerfil && selectPets) {
    llenarSelect({
      endpoint: "mascotas",
      selector: "#select-pets",
      optionMapper: (pet) => ({
        id: pet.id,
        text: `${pet.raza.nombre} - ${pet.nombre}`,
      }),
    });
  } else if (selectPets) {
    const contenedorCampo = selectPets.closest(".form__container-field");
    contenedorCampo.classList.add("hidden");
  }

  // Preparación de validaciones para el formulario
  const form = DOMSelector("#form-register-pet-antecedent");
  configurarEventosValidaciones(form);

  // Manejo de envío del formulario de edición
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validamos campos antes de procesar
    if (!validarCampos(e)) return;

    // Asociamos la mascota al objeto de datos a enviar
    datos.mascota_id = mascota.id;
    console.log(datos);

    // Enviamos solicitud PUT para actualizar el antecedente
    const updateResp = await put(`antecedentes/${antecedente.id}`, datos);

    if (!updateResp.success) {
      await error(updateResp.message);
      return;
    }

    // Actualizamos el DOM con los nuevos datos del antecedente
    DOMSelector(
      `[data-idAntecendente="${antecedente.id}"] .antecedente-titulo`
    ).textContent = updateResp.data.titulo;
    DOMSelector(
      `[data-idAntecendente="${antecedente.id}"] .antecedente-diagnostico`
    ).innerHTML = `<strong>Diagnóstico:</strong> ${updateResp.data.diagnostico}`;

    // Mostramos mensaje de éxito y cerramos modal
    successTemporal(updateResp.message);
    cerrarModal("edit-pet-antecedent");
    history.back();
  });

  // Botón de volver: cierra modal y regresa en historial
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id === "back-edit-pet-antecedent") {
      cerrarModal("edit-pet-antecedent");
      history.back();
    }
  });
};
