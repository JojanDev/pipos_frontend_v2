import { routes } from "../../../../router/routes";
import {
  error,
  get,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  convertirADiaMesAño,
  formatearPrecioConPuntos,
} from "../../../../helpers";

/* ================================
   Asignadores de datos al DOM
================================ */

/**
 * Asigna los datos del lote a los elementos del perfil.
 * @param {Object} data - Datos del lote.
 */
const asignarDatosLote = (data) => {
  const {
    numero_lote,
    fecha_caducidad,
    precio,
    cantidad,
    info: { nombre },
  } = data;

  document.querySelector(
    "#profile-numeroLote"
  ).textContent = `Lote: ${numero_lote}`;
  document.querySelector("#profile-fechaCaducidad").textContent =
    convertirADiaMesAño(fecha_caducidad);
  document.querySelector("#profile-precio").textContent =
    formatearPrecioConPuntos(precio);
  document.querySelector("#profile-cantidad").textContent = cantidad;
};

/**
 * Asigna los datos de la información general del medicamento.
 * @param {Object} data - Datos de información general del medicamento.
 */
export const asignarDatosMedicamentoInfo = (data) => {
  const { nombre, uso_general, via_administracion, presentacion } = data;

  document.querySelector("#profile-medicament-info-nombre").textContent =
    nombre;
  document.querySelector("#profile-medicament-info-usoGeneral").textContent =
    uso_general;
  document.querySelector("#profile-medicament-info-Via").textContent =
    via_administracion;
  document.querySelector("#profile-medicament-info-presentacion").textContent =
    presentacion;
};

/* ================================
   Controlador principal
================================ */

/**
 * Controlador para la vista de perfil del medicamento.
 * @param {Object|null} parametros - Parámetros que contienen el ID del medicamento.
 */
export const profileMedicamentController = async (parametros = null) => {
  const esModal = !location.hash.includes("inventario/medicamentosPerfil");
  const contenedor = document.querySelector(
    "[data-modal='profile-medicament']"
  );

  const { id } = parametros;
  const response = await get(`medicamentos/${id}`);

  if (!response.success) {
    await error(response.message);
    esModal
      ? cerrarModal("profile-medicament")
      : cerrarModalYVolverAVistaBase();
    return;
  }

  asignarDatosLote(response.data);
  asignarDatosMedicamentoInfo(response.data.info);

  contenedor.addEventListener("click", async (e) => {
    const idTarget = e.target.id;

    if (idTarget == "back-profile-medicament")
      esModal
        ? cerrarModal("profile-medicament")
        : cerrarModalYVolverAVistaBase();
    if (idTarget == "edit-medicament-info") {
      await cargarComponente(routes.medicamentos_info.editar, {
        idInfo: response.data.info.id,
        idMedicamento: id,
      });
    }
  });
};
