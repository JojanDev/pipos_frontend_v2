import { get } from "./api";

/**
 * Crea un bloque de antecedente completo con encabezado, diagnóstico, lista de tratamientos
 * y controles para editar o eliminar el antecedente.
 *
 * @param {Object} params
 * @param {number|string} params.id              - Identificador único del antecedente.
 * @param {string}       params.titulo          - Título o nombre del antecedente.
 * @param {string}       params.diagnostico     - Descripción del diagnóstico.
 * @param {string}       params.fecha_creado    - Fecha ISO de creación del antecedente.
 * @param {Array}        [params.tratamientos]  - Array inicial de tratamientos (no utilizado directamente aquí).
 * @param {string}       [params.message]       - Mensaje a mostrar si no hay tratamientos registrados.
 * @returns {Promise<HTMLElement>}
 *   Elemento `<div>` con clase "antecedente" que contiene todo el bloque armado.
 *
 */
export const crearBloqueAntecedenteCompleto = async ({
  id,
  titulo,
  diagnostico,
  fecha_creado,
  tratamientos = [],
  message = "No hay tratamientos registrados",
}) => {
  // Formatear fecha del antecedente
  const fechaFormateada = convertirADiaMesAño(fecha_creado);

  // Contenedor principal del antecedente
  const divAntecedente = document.createElement("div");
  divAntecedente.classList.add("antecedente");
  divAntecedente.setAttribute("data-idAntecendente", id);

  // Encabezado con fecha, título y botones de editar/eliminar
  const divHeader = document.createElement("div");
  divHeader.classList.add("antecedente-header");

  // Fecha formateada
  const spanFecha = document.createElement("span");
  spanFecha.textContent = fechaFormateada;

  // Título del antecedente
  const spanTitulo = document.createElement("span");
  spanTitulo.classList.add("antecedente-titulo");
  spanTitulo.textContent = titulo;

  // Ícono editar (permiso: antecedente.update)
  const iconEdit = document.createElement("i");
  iconEdit.classList.add("ri-edit-box-line", "edit-antecedent", "btn--orange");
  iconEdit.dataset.permiso = "antecedente.update";

  // Ícono eliminar (permiso: antecedente.delete)
  const iconDelete = document.createElement("i");
  iconDelete.classList.add(
    "ri-delete-bin-line",
    "delete-antecedent",
    "btn--red",
    "admin"
  );
  iconDelete.dataset.permiso = "antecedente.delete";

  // Agregar elementos al header
  divHeader.appendChild(spanFecha);
  divHeader.appendChild(spanTitulo);
  divHeader.appendChild(iconEdit);
  divHeader.appendChild(iconDelete);

  // Cuerpo con diagnóstico y sección de tratamientos
  const divBody = document.createElement("div");
  divBody.classList.add("antecedente-body");

  // Párrafo de diagnóstico
  const pDiagnostico = document.createElement("p");
  pDiagnostico.classList.add("antecedente-diagnostico");
  pDiagnostico.innerHTML = `<strong>Diagnóstico:</strong> ${diagnostico}`;
  divBody.appendChild(pDiagnostico);

  // Separador de tratamientos
  const pSeparador = document.createElement("p");
  pSeparador.classList.add("perfil__separador", "perfil__separador--treatment");
  pSeparador.textContent = "Tratamientos";
  divBody.appendChild(pSeparador);

  // Obtener tratamientos asociados al antecedente
  const tratamientosResponse = await get(`tratamientos/antecedente/${id}`);

  if (tratamientosResponse.success) {
    // Crear un elemento por cada tratamiento
    tratamientosResponse.data.forEach((tratamiento) => {
      const divTratamiento = crearElementoTratamiento(tratamiento);
      divBody.appendChild(divTratamiento);
    });
  } else if (message) {
    // Mostrar mensaje si no hay tratamientos
    const mensajeSinTratamientos = document.createElement("p");
    mensajeSinTratamientos.classList.add("mensaje-sin-tratamientos");
    mensajeSinTratamientos.textContent = message;
    divBody.appendChild(mensajeSinTratamientos);
  }

  // Ícono para agregar nuevos tratamientos (permiso: tratamiento.create)
  const iconoAdd = document.createElement("i");
  iconoAdd.classList.add("ri-add-line", "plus-icon");
  iconoAdd.setAttribute("id", "register-treatment-antecedent");
  iconoAdd.dataset.permiso = "tratamiento.create";
  divBody.appendChild(iconoAdd);

  // Ensamblar header y body en el contenedor principal
  divAntecedente.appendChild(divHeader);
  divAntecedente.appendChild(divBody);

  return divAntecedente;
};

/**
 * Crea un elemento visual para un tratamiento individual.
 *
 * @param {Object} tratamiento
 * @param {number|string} tratamiento.id            - Identificador del tratamiento.
 * @param {string}       tratamiento.titulo        - Título descriptivo.
 * @param {string}       tratamiento.fecha_creado  - Fecha ISO de creación.
 * @returns {HTMLElement}
 *   Elemento `<div>` con clase "tratamiento" que muestra fecha y título.
 */
export const crearElementoTratamiento = ({ id, titulo, fecha_creado }) => {
  const divTratamiento = document.createElement("div");
  divTratamiento.classList.add("tratamiento");
  divTratamiento.setAttribute("data-idTratamiento", id);

  // Fecha formateada en cada tratamiento
  const spanFechaTratamiento = document.createElement("span");
  spanFechaTratamiento.textContent = convertirADiaMesAño(fecha_creado);

  divTratamiento.appendChild(spanFechaTratamiento);
  divTratamiento.appendChild(document.createTextNode(titulo));

  return divTratamiento;
};

/**
 * Convierte una fecha ISO a formato dd/mm/aaaa.
 *
 * @param {string} fechaCompleta - Cadena de fecha en formato ISO.
 * @returns {string}         Fecha formateada como "dd/mm/aaaa".
 */
export const convertirADiaMesAño = (fechaCompleta) => {
  const fecha = new Date(fechaCompleta);
  const day = fecha.getDate().toString().padStart(2, "0");
  const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const year = fecha.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Verifica si un antecedente ya no tiene tratamientos y, de ser así,
 * inserta un mensaje informativo antes del ícono de agregar.
 *
 * @param {number|string} idAntecedente - ID del antecedente a revisar.
 * @returns {void}
 *
 */
export function mostrarMensajeSiNoHayTratamientos(idAntecedente) {
  // Seleccionar el body del antecedente correspondiente
  const divBody = document.querySelector(
    `[data-idAntecendente='${idAntecedente}'] .antecedente-body`
  );
  if (!divBody) return;

  // Revisar tratamientos presentes
  const tratamientosRestantes = divBody.querySelectorAll(".tratamiento");
  const mensajeExistente = divBody.querySelector(".mensaje-sin-tratamientos");

  // Si no hay tratamientos y aún no se ha mostrado el mensaje
  if (tratamientosRestantes.length === 0 && !mensajeExistente) {
    const mensajeSinTratamientos = document.createElement("p");
    mensajeSinTratamientos.classList.add("mensaje-sin-tratamientos");
    mensajeSinTratamientos.textContent = "No hay tratamientos registrados";

    // Insertar mensaje antes del botón de agregar tratamientos
    const plusIcon = divBody.querySelector(".plus-icon");
    divBody.insertBefore(mensajeSinTratamientos, plusIcon);
  }
}
