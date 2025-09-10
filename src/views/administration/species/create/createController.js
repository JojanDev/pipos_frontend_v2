import {
  post, // para crear la especie en el backend
  configurarEventosValidaciones, // inicializa validaciones en el formulario
  datos, // objeto con los datos recolectados por las validaciones/helpers
  validarCampos, // valida campos del formulario
  crearFila, // utilidad para generar filas de tabla en el DOM
  error, // muestra mensajes de error
  cerrarModal, // cierra modal por id
  DOMSelector, // selector simplificado del DOM
  successTemporal, // muestra mensaje de éxito temporal
} from "../../../../helpers";
import {
  cargarRazasDeEspecie,
  especiesConRazas,
} from "../../administrationController";

/**
 * Controlador para crear una especie.
 * - Configura validaciones del formulario.
 * - Envía petición POST para crear la especie.
 * - Actualiza la tabla de especies en la UI y el array en memoria `especiesConRazas`.
 *
 * @param {Object|null} parametros - Parámetros opcionales desde la vista (no obligatorios).
 * @returns {void}
 */
export const createSpecieController = (parametros = null) => {
  // Selecciona el formulario de registro de especie
  const form = DOMSelector("#form-register-specie");

  // Indica si se está mostrando como modal o en una ruta (no se usa aquí,
  // pero se mantiene la variable por coherencia con otros controladores)
  const esModal = !location.hash.includes("especiesCrear");

  // Referencia al tbody de la tabla de especies donde se agregarán filas
  const tbody = DOMSelector("#species .table__body");

  // Inicializa validaciones/eventos asociados al formulario
  configurarEventosValidaciones(form);

  // Listener submit: proceso para crear la especie
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita el submit tradicional del navegador

    // Valida los campos del formulario; si falla, no continuar
    if (!validarCampos(e)) return;

    // Llamada POST al backend para crear la especie con los datos recolectados
    const responseEspecie = await post("especies", datos);

    // Si la creación falla, mostrar mensaje de error y salir
    if (!responseEspecie.success) {
      await error(responseEspecie.message);
      return;
    }

    // Muestra mensaje de éxito temporal al usuario
    successTemporal(responseEspecie.message);

    // Crea el botón para la fila (ícono editar/ver)
    const btn = document.createElement("button");
    const i = document.createElement("i");
    btn.append(i);
    i.classList.add("ri-eye-line");
    btn.classList.add("btn", "btn--edit", "fw-400");

    // Crea la fila con id, nombre y el botón creado
    const row = crearFila([
      responseEspecie.data.id,
      responseEspecie.data.nombre,
      btn,
    ]);

    // Prepara el botón 'Registrar raza' (se habilita cuando una especie está seleccionada)
    const btnRegistrarRaza = DOMSelector("#btn-registro-raza");

    // Construye el objeto especie con su array de razas vacío y lo agrega a la memoria local
    const especieNueva = { ...responseEspecie.data, razas: [] };
    especiesConRazas.push(especieNueva);

    // Al hacer click en la fila recién creada: marcarla, cargar sus razas y habilitar el botón
    row.addEventListener("click", () => {
      // Quita la selección de otras filas
      tbody
        .querySelectorAll(".table__row")
        .forEach((fila) => fila.classList.remove("table__row--selected"));

      // Marca la fila nueva como seleccionada
      row.classList.add("table__row--selected");

      // Carga (renderiza) las razas de la especie (vacío inicialmente)
      cargarRazasDeEspecie(especieNueva);

      // Activa el botón para registrar nuevas razas
      btnRegistrarRaza.disabled = false;
    });

    // Inserta la fila al inicio del tbody para que sea visible inmediatamente
    tbody.insertAdjacentElement("afterbegin", row);

    // Simula un click para seleccionar la fila y mostrar su contenido/estado
    row.click();

    // Cierra el modal y vuelve en el historial de navegación
    cerrarModal("create-specie");
    history.back();
  });

  // Botón físico/elemento de volver dentro del formulario/modal
  const btnAtras = DOMSelector("#back-register-specie");

  // Evento para el botón regresar: cierra modal y vuelve en el historial
  btnAtras.addEventListener("click", () => {
    cerrarModal("create-specie");
    history.back();
  });
};
