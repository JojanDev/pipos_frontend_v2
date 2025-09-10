// Helpers
import {
  error,
  get,
  post,
  llenarSelect,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  cerrarModal,
  DOMSelector,
  successTemporal,
  crearBloqueAntecedenteCompleto,
  renderNotFound,
} from "../../../helpers";

/**
 * Controlador para crear un antecedente de mascota.
 * Valida estado de la mascota, configura el formulario y gestiona el envío y la navegación.
 *
 * @param {Object|null} parametros - Parámetros de entrada.
 * @param {Object} parametros.perfil - Perfil de la mascota seleccionada.
 * @returns {Promise<void>} - No retorna nada; actualiza el DOM, realiza peticiones y controla modales.
 *
 */
export const createAntecedentController = async (parametros = null) => {
  // Extraemos la mascota del perfil recibido
  const { perfil: mascota } = parametros;

  // Obtenemos la mascota para verificar su estado vital
  const getMascota = await get(`mascotas/${mascota.id}`);

  // Si la mascota está fallecida, mostramos la vista de no encontrado
  if (!getMascota.data.estado_vital) {
    await renderNotFound();
    return;
  }

  // Contenedores principales: perfil de mascota y modal de creación
  const containerPerfilMascota = DOMSelector("#pet-profile");
  const contenedorVista = DOMSelector('[data-modal="create-pet-antecedent"]');
  const selectPets = DOMSelector("#select-pets");

  // Si no estamos en el perfil de la mascota, cargamos opciones en el select;
  // de lo contrario, ocultamos el campo de selección
  if (!containerPerfilMascota) {
    if (selectPets) {
      llenarSelect({
        endpoint: "mascotas",
        selector: "#select-pets",
        optionMapper: (pet) => ({
          id: pet.id,
          text: `${pet.raza.nombre} - ${pet.nombre}`,
        }),
      });
    }
  } else {
    const contenedorCampo = selectPets.closest(".form__container-field");
    contenedorCampo.classList.add("hidden");
  }

  // Preparamos validaciones para el formulario de creación
  const form = DOMSelector("#form-register-pet-antecedent");
  configurarEventosValidaciones(form);

  // Manejo del envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validamos campos antes de enviar
    if (!validarCampos(e)) return;

    // Creamos el antecedente vía POST
    const antecedentResponse = await post("antecedentes", {
      ...datos,
      mascota_id: mascota.id,
    });

    // Si falla la creación, mostramos error
    if (!antecedentResponse.success) {
      await error(antecedentResponse.message);
      return;
    }

    // Insertamos el nuevo bloque de antecedente en la vista de perfil
    const contenedorAntecedente = DOMSelector("#profile-pet-antecedent");
    if (contenedorAntecedente) {
      const nuevoBloque = await crearBloqueAntecedenteCompleto(
        antecedentResponse.data
      );
      contenedorAntecedente.insertAdjacentElement("afterbegin", nuevoBloque);

      // Removemos el placeholder si existía
      const placeholder = DOMSelector(".placeholder-antecedentes");
      if (placeholder) placeholder.remove();
    }

    // Mensaje temporal de éxito y cierre del modal
    successTemporal(antecedentResponse.message);
    cerrarModal("create-pet-antecedent");
    history.back();
  });

  // Manejo de clic en el botón de volver para cerrar modal y navegar atrás
  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id === "back-register-pet-antecedent") {
      cerrarModal("create-pet-antecedent");
      history.back();
    }
  });
};
