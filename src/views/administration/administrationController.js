import { crearFila, DOMSelector, get } from "../../helpers";
import hasPermission from "../../helpers/hasPermission";

export let especiesConRazas = [];

/**
 * Lista todos los tipos de productos y los renderiza en la tabla correspondiente.
 * @async
 * @returns {Promise<void>}
 */
export const listarTiposProductos = async () => {
  // Hace la petición GET al endpoint de tipos de productos
  const response = await get("tipos-productos");

  // Selecciona el cuerpo de la tabla donde se mostrarán los tipos
  const tbody = DOMSelector("#productsTypes .table__body");

  // Limpia contenido previo por si se recarga
  tbody.innerHTML = "";

  // Si la petición falla, muestra un placeholder informativo
  if (!response.success) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("placeholder");
    placeholder.textContent = "No hay tipos registrados";
    tbody.append(placeholder);
    return;
  }

  // Recorre los datos y crea una fila por cada tipo de producto
  response.data.forEach(({ id, nombre }) => {
    const row = crearFila([id, nombre]);
    tbody.append(row);
  });
};

/**
 * Lista todas las especies y obtiene sus razas asociadas.
 * Renderiza las especies y prepara la UI para gestionar razas.
 * @async
 * @returns {Promise<void>}
 */
export const listarEspecies = async () => {
  // Petición al backend para obtener especies
  const response = await get("especies");

  // Elementos del DOM que se usarán
  const tbody = DOMSelector("#species .table__body");
  tbody.innerHTML = "";

  const razasTbody = DOMSelector("#breeds .table__body");
  const btnRegistrarRaza = DOMSelector("#btn-registro-raza");
  razasTbody.innerHTML = "";

  // Si no hay especies, mostramos placeholder y desactivamos el botón
  if (!response.success) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("placeholder");
    placeholder.textContent = "No hay especies registradas";
    tbody.append(placeholder);

    mostrarMensajePlaceholderRazas("Seleccione una especie");
    btnRegistrarRaza.disabled = true;
    return;
  }

  // Obtiene cada especie y sus razas (paraleliza las peticiones)
  especiesConRazas = await Promise.all(
    response.data.map(async (especie) => {
      const razasEspecie = await get(`razas/especie/${especie.id}`);
      return { ...especie, razas: razasEspecie.data ?? [] };
    })
  );

  // Renderiza cada especie en la tabla
  especiesConRazas.forEach((especie) => {
    // Crea botón con ícono para la fila
    const btn = document.createElement("button");
    const i = document.createElement("i");
    btn.append(i);
    i.classList.add("ri-eye-line");
    btn.classList.add("btn", "btn--edit", "fw-400");

    // Crea la fila con id, nombre y botón
    const row = crearFila([especie.id, especie.nombre, btn]);

    // Evento: al hacer click, marca la fila como seleccionada y carga las razas
    row.addEventListener("click", () => {
      // Quita la clase de selección de otras filas
      tbody
        .querySelectorAll(".table__row")
        .forEach((fila) => fila.classList.remove("table__row--selected"));

      // Marca la fila actual como seleccionada
      row.classList.add("table__row--selected");

      // Carga las razas en la tabla de razas
      cargarRazasDeEspecie(especie);

      // Activa el botón para registrar raza
      btnRegistrarRaza.disabled = false;
    });

    // Agrega la fila a la tabla de especies
    tbody.append(row);
  });

  // Evento del botón registrar raza: redirige a la vista de creación usando el id de especie seleccionada
  btnRegistrarRaza.addEventListener("click", () => {
    const especieSeleccionada = DOMSelector(".table__row--selected");
    const idEspecie = especieSeleccionada?.children[0]?.textContent?.trim();

    if (idEspecie) {
      // Añade la ruta relativa para crear la raza de la especie seleccionada
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `especies/id=${idEspecie}/razas/crear`
          : `/especies/id=${idEspecie}/razas/crear`);
    }
  });

  // Mensaje por defecto si no hay selección
  mostrarMensajePlaceholderRazas("Seleccione una especie");
  btnRegistrarRaza.disabled = true;
};

/**
 * Carga y renderiza las razas de una especie dada.
 * @param {Object} especie - Objeto especie que contiene una propiedad `razas` (array).
 * @returns {void}
 */
export const cargarRazasDeEspecie = (especie) => {
  // Selecciona el tbody de razas y limpia su contenido
  const razasTbody = DOMSelector("#breeds .table__body");
  razasTbody.innerHTML = "";

  // Si no hay razas, muestra placeholder
  if (!especie.razas || especie.razas.length === 0) {
    mostrarMensajePlaceholderRazas(
      "No hay razas registradas para esta especie"
    );
    return;
  }

  // Crea una fila por cada raza y la agrega al tbody
  especie.razas.forEach((raza) => {
    const row = crearFila([raza.id, raza.nombre]);
    razasTbody.append(row);
  });
};

/**
 * Muestra un mensaje placeholder en la tabla de razas.
 * @param {string} mensaje - Texto a mostrar.
 */
export const mostrarMensajePlaceholderRazas = (mensaje) => {
  const razasTbody = DOMSelector("#breeds .table__body");
  razasTbody.innerHTML = "";
  const placeholder = document.createElement("p");
  placeholder.classList.add("placeholder");
  placeholder.textContent = mensaje;
  razasTbody.append(placeholder);
};

/**
 * Controlador principal para la vista de administración.
 * - Inicia la carga de datos
 * - Filtra acciones según permisos
 * - Añade listeners a tablas para navegación
 */
export const administrationController = () => {
  // Inicia las cargas necesarias
  listarTiposProductos();
  listarEspecies();

  // Elementos del DOM relevantes
  const tablaRazas = DOMSelector("#breeds");
  const contenedorVista = DOMSelector("#inventory");

  // Obtiene acciones que contienen el atributo data-permiso
  const acciones = Array.from(
    contenedorVista.querySelectorAll(`[data-permiso]`)
  );

  // Recorre las acciones y elimina las que el usuario no tiene permiso
  for (const accion of acciones) {
    const permisos = accion.dataset.permiso.split(",");
    if (!hasPermission(permisos)) {
      accion.remove();
    }
  }

  // Listener en la tabla de razas: redirige al perfil de raza seleccionado
  tablaRazas.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idRaza = fila.getAttribute("data-id");
      const especieSeleccionada = DOMSelector(".table__row--selected");
      const idEspecie = especieSeleccionada?.children[0]?.textContent?.trim();

      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `especies/id=${idEspecie}/razas/perfil/id=${idRaza}`
          : `/especies/id=${idEspecie}/razas/perfil/id=${idRaza}`);
    }
  });

  // Listener en la tabla de especies: si se hace click en el botón editar, redirige al perfil de especie
  const tablaEspecies = DOMSelector("#species");
  tablaEspecies.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    const btn = event.target.closest(".btn--edit");

    if (btn && fila) {
      const idEspecie = fila.getAttribute("data-id");

      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `especies/perfil/id=${idEspecie}`
          : `/especies/perfil/id=${idEspecie}`);
    }
  });

  // Listener en la tabla de tipos de productos: redirige al perfil de tipo seleccionado
  const tablaTipoProducto = DOMSelector("#productsTypes");
  tablaTipoProducto.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idTipo = fila.getAttribute("data-id");

      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `tipos-productos/perfil/id=${idTipo}`
          : `/tipos-productos/perfil/id=${idTipo}`);
    }
  });
};
