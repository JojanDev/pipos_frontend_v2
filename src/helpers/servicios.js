import { formatearPrecioConPuntos } from "./diseño";

/**
 * Crea una tarjeta de servicio con imagen, titulo, descripcion, precio
 * y botones de editar/eliminar segun permisos del usuario.
 *
 * @param {number|string} id           - Identificador unico del servicio.
 * @param {string}        nombre       - Nombre del servicio.
 * @param {string}        descripcion  - Descripcion detallada del servicio.
 * @param {number}        precio       - Valor numerico del servicio.
 * @returns {HTMLDivElement} Elemento <div> con clase "card" que representa el servicio.
 */
export function crearCardServicio(id, nombre, descripcion, precio) {
  // Crear contenedor principal de la tarjeta
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = id;

  // Agregar imagen por defecto del servicio
  const imagen = document.createElement("img");
  imagen.src = "../../../public/logoService.png";
  imagen.alt = "";
  imagen.classList.add("card__img");
  card.appendChild(imagen);

  // Mostrar precio formateado con separador de miles
  const precioP = document.createElement("p");
  precioP.classList.add("card__precio");
  precioP.textContent = "Valor: " + formatearPrecioConPuntos(precio);
  card.appendChild(precioP);

  // Contenedor para titulo y descripcion con scroll si es necesario
  const contenido = document.createElement("div");
  contenido.classList.add("scroll-cont");

  // Titulo del servicio
  const tituloElemento = document.createElement("h3");
  tituloElemento.classList.add("card__title");
  tituloElemento.textContent = nombre;
  contenido.appendChild(tituloElemento);

  // Descripcion del servicio
  const descripcionElemento = document.createElement("p");
  descripcionElemento.classList.add("card__description");
  descripcionElemento.textContent = descripcion;
  contenido.appendChild(descripcionElemento);

  card.appendChild(contenido);

  // Boton de editar servicio (requiere permiso servicio.update)
  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btn", "btn--edit", "btn-servicio-edit", "admin");
  btnEdit.title = "Editar servicio";
  btnEdit.dataset.permiso = "servicio.update";
  const iconEdit = document.createElement("i");
  iconEdit.classList.add("ri-edit-box-line");
  btnEdit.appendChild(iconEdit);
  card.appendChild(btnEdit);

  // Boton de eliminar servicio (requiere permiso servicio.delete)
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btn", "btn--red", "btn-servicio-delete", "admin");
  btnDelete.title = "Eliminar servicio";
  btnDelete.dataset.permiso = "servicio.delete";
  const iconDelete = document.createElement("i");
  iconDelete.classList.add("ri-delete-bin-line");
  btnDelete.appendChild(iconDelete);
  card.appendChild(btnDelete);

  return card;
}

/**
 * Inserta un texto placeholder dentro de un contenedor
 * cuando no hay servicios para mostrar.
 *
 * @param {HTMLElement} contenedor - Elemento donde se mostrara el placeholder.
 * @param {string}      mensaje    - Texto descriptivo a mostrar.
 */
export function mostrarPlaceholderServicios(contenedor, mensaje) {
  const placeholder = document.createElement("p");
  placeholder.classList.add("placeholder");
  placeholder.textContent = mensaje;
  contenedor.appendChild(placeholder);
}
