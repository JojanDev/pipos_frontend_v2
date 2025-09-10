// Helpers
import {
  error,
  get,
  del,
  crearFila,
  cerrarModal,
  capitalizarPrimeraLetra,
  convertirDias,
  mapearDatosEnContenedor,
  mostrarMensajeSiNoHayTratamientos,
  DOMSelector,
  DOMSelectorAll,
  errorTemporal,
  successTemporal,
} from "../../../helpers";

// Permissions
import hasPermission from "../../../helpers/hasPermission";

// Formatters
import { formatoCorto } from "../../ventas/profile/profileController";

/**
 * Elimina del DOM un tratamiento y muestra un mensaje si ya no quedan tratamientos.
 *
 * @param {string} idTratamiento - ID del tratamiento a eliminar.
 * @param {string} idAntecedente - ID del antecedente para verificar tratamientos restantes.
 */
function eliminarTratamiento(idTratamiento, idAntecedente) {
  // Buscamos el elemento del tratamiento por su data attribute
  const tratamientoEl = DOMSelector(`[data-idTratamiento='${idTratamiento}']`);
  if (tratamientoEl) {
    // Quitamos el elemento del DOM
    tratamientoEl.remove();
    // Verificamos si quedan tratamientos para mostrar placeholder
    mostrarMensajeSiNoHayTratamientos(idAntecedente);
  }
}

/**
 * Desactiva todos los botones de acción en la vista de perfil de tratamiento.
 * Elimina tanto los botones fijos como los iconos de editar/eliminar en la tabla.
 */
const desactivarBotonesPerfilTratamiento = () => {
  // Selectores de botones fijos en el modal de tratamiento
  const fixedSelectors = [
    "#register-antecedent-treatment-medicament",
    "#delete-treatment",
    "#edit-treatment",
  ];
  // Eliminamos cada botón fijo si existe
  fixedSelectors.forEach((selector) => {
    const btn = DOMSelector(selector);
    if (btn) btn.remove();
  });

  // Eliminamos los iconos de eliminar dentro de la tabla de medicamentos
  DOMSelectorAll(".delete-tabla").forEach((btn) => btn.remove());
  // Eliminamos los iconos de editar dentro de la tabla de medicamentos
  DOMSelectorAll(".edit-tabla").forEach((btn) => btn.remove());
};

/**
 * Controlador para gestionar el detalle de un tratamiento y sus medicamentos.
 * Obtiene datos de tratamiento, usuario y antecedente; renderiza la vista; filtra acciones por permisos; y maneja eventos de crear, editar y eliminar.
 *
 * @param {Object|null} parametros - Parámetros de entrada.
 * @param {Object} parametros.perfil - Objeto con datos del tratamiento.
 * @param {Object} parametros.antecedente - Objeto con datos del antecedente relacionado.
 * @returns {Promise<void>} - No retorna dato; actualiza el DOM, realiza peticiones HTTP y controla modales.
 *
 */
export const treatmentController = async (parametros = null) => {
  // Extraemos tratamiento y antecedente de los parámetros
  const { perfil: tratamiento, antecedente } = parametros;

  // Seleccionamos el modal y el cuerpo de la tabla de medicamentos
  const modal = DOMSelector('[data-modal="pet-treatment"]');
  const tbody = DOMSelector("#pet-antecedent-treatment .table__body");

  // Obtenemos datos del tratamiento
  const tratamientoResp = await get(`tratamientos/${tratamiento.id}`);
  // Obtenemos datos del usuario que creó el tratamiento
  const { data: veterinario } = await get(
    `usuarios/${tratamientoResp.data.usuario_id}`
  );

  // Si falla la petición del tratamiento, mostramos error y cerramos modal
  if (!tratamientoResp.success) {
    await error(tratamientoResp.message);
    cerrarModal("pet-treatment");
    history.back();
    return;
  }

  // Obtenemos datos del antecedente para el título en la vista
  const antecedenteResp = await get(`antecedentes/${antecedente.id}`);

  // Formateamos fecha de creación y mapeamos datos en el modal
  tratamientoResp.data.fecha_creado = formatoCorto(
    tratamientoResp.data.fecha_creado
  );
  mapearDatosEnContenedor(
    {
      ...tratamientoResp.data,
      veterinario: `${veterinario.nombre} ${veterinario.apellido}`,
      "titulo-antecedente": antecedenteResp.data.titulo,
    },
    modal
  );

  // Obtenemos los medicamentos asociados al tratamiento
  const medsResp = await get(
    `medicamentos-tratamientos/tratamiento/${tratamientoResp.data.id}`
  );
  if (medsResp.success) {
    // Por cada medicamento, creamos y añadimos una fila a la tabla
    await Promise.all(
      medsResp.data.map(
        async ({
          id,
          info_medicamento_id,
          dosis,
          duracion,
          frecuencia_aplicacion,
        }) => {
          // Creamos icono para eliminar con permiso
          const iconDelete = document.createElement("i");
          iconDelete.classList.add(
            "ri-delete-bin-line",
            "delete-tabla",
            "btn--red",
            "admin"
          );
          iconDelete.dataset.permiso = "medicamento-tratamiento.delete";

          // Creamos icono para editar con permiso
          const iconEdit = document.createElement("i");
          iconEdit.classList.add(
            "ri-edit-box-line",
            "edit-tabla",
            "btn--orange"
          );
          iconEdit.dataset.permiso = "medicamento-tratamiento.update";

          // Obtenemos información adicional del medicamento
          const { data: medInfo } = await get(
            `info-medicamentos/${info_medicamento_id}`
          );

          // Construimos y añadimos la fila a la tabla
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
          tbody.append(row);
        }
      )
    );
  } else {
    // Mostramos error temporal si falla la carga de medicamentos
    errorTemporal(medsResp.message);
  }

  // Verificamos estado vital de la mascota y desactivamos botones si está fallecida
  const petResp = await get(`mascotas/${antecedenteResp.data.mascota_id}`);
  if (!petResp.data.estado_vital) {
    desactivarBotonesPerfilTratamiento();
  }

  // Filtramos los botones de acción dentro del modal según permisos del usuario
  DOMSelectorAll("[data-permiso]").forEach((accion) => {
    const requiredPerms = accion.dataset.permiso.split(",");
    if (!hasPermission(requiredPerms)) {
      accion.remove();
    }
  });

  // Manejamos clicks en el modal para crear/editar/eliminar tratamientos y medicamentos
  modal.addEventListener("click", async (e) => {
    // Navegar a creación de medicamento
    if (e.target.id === "register-antecedent-treatment-medicament") {
      location.hash = `${location.hash}${
        location.hash.endsWith("/") ? "" : "/"
      }medicamento/crear`;
    }

    // Cerrar modal y regresar en historial
    if (e.target.id === "back-treatment") {
      cerrarModal("pet-treatment");
      history.back();
    }

    // Eliminar un medicamento
    if (e.target.classList.contains("delete-tabla")) {
      const medEl = e.target.closest("[data-id]");
      const medId = medEl.getAttribute("data-id");
      const delMedResp = await del(`medicamentos-tratamientos/${medId}`);
      if (!delMedResp.success) {
        await error(delMedResp.message);
        return;
      }
      medEl.remove();
      successTemporal(delMedResp.message);
    }

    // Editar un medicamento
    if (e.target.classList.contains("edit-tabla")) {
      const medEl = e.target.closest("[data-id]");
      const medId = medEl.getAttribute("data-id");
      location.hash = `${location.hash}${
        location.hash.endsWith("/") ? "" : "/"
      }medicamento/editar/id=${medId}`;
    }

    // Eliminar el tratamiento
    if (e.target.id === "delete-treatment") {
      const delTreatResp = await del(`tratamientos/${tratamiento.id}`);
      if (!delTreatResp.success) {
        await error(delTreatResp.message);
        return;
      }
      eliminarTratamiento(tratamiento.id, antecedente.id);
      successTemporal(delTreatResp.message);
      cerrarModal("pet-treatment");
      history.back();
    }

    // Editar el tratamiento
    if (e.target.id === "edit-treatment") {
      location.hash = `${location.hash}${
        location.hash.endsWith("/") ? "" : "/"
      }editar`;
    }
  });
};
