import { capitalizarPrimeraLetra } from "../helpers/diseño";

/**
 * Crea una tarjeta HTML que muestra información de un medicamento.
 *
 * La tarjeta incluye imagen, nombre, uso general, vía de administración
 * y presentación. Cada campo se formatea adecuadamente.
 *
 * @param {Object} medicamento
 * @param {number|string} medicamento.id                  - Identificador único del medicamento.
 * @param {string}        medicamento.nombre              - Nombre comercial o genérico.
 * @param {string}        medicamento.uso_general         - Descripción de uso general.
 * @param {string}        medicamento.via_administracion  - Vía de administración (oral, tópica, etc.).
 * @param {string}        medicamento.presentacion        - Presentación (tabletas, jarabe, etc.).
 * @returns {HTMLElement} Elemento <div> con clase "card" que contiene la información del medicamento.
 */
export function crearCartaMedicamento(medicamento) {
  // Contenedor principal de la tarjeta
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = medicamento.id;

  // Imagen del medicamento
  const img = document.createElement("img");
  img.src = "../../../public/medicamentosLogo.png";
  img.alt = "";
  img.classList.add("card__img");
  card.appendChild(img);

  // Título con el nombre del medicamento
  const title = document.createElement("h3");
  title.classList.add("card__title");
  title.id = "nombre-medicamento-info";
  title.textContent = medicamento.nombre;
  card.appendChild(title);

  // Contenedor para los campos de datos
  const contDatos = document.createElement("div");
  contDatos.classList.add(
    "perfil__contenedor-datos-personales",
    "perfil__contenedor-datos-personales--col-1",
    "perfil__contenedor-datos-personales--span2"
  );

  // Uso general
  const pUso = document.createElement("p");
  pUso.classList.add("perfil__campo", "perfil__campo--beetwen");
  pUso.textContent = "Uso general:";
  const spanUso = document.createElement("span");
  spanUso.classList.add("perfil__valor");
  spanUso.id = "uso-medicamento-info";
  spanUso.textContent = capitalizarPrimeraLetra(medicamento.uso_general);
  pUso.appendChild(spanUso);

  // Vía de administración
  const pVia = document.createElement("p");
  pVia.classList.add("perfil__campo", "perfil__campo--beetwen");
  pVia.textContent = "Vía administración:";
  const spanVia = document.createElement("span");
  spanVia.classList.add("perfil__valor");
  spanVia.id = "via-medicamento-info";
  spanVia.textContent = capitalizarPrimeraLetra(medicamento.via_administracion);
  pVia.appendChild(spanVia);

  // Presentación
  const pPres = document.createElement("p");
  pPres.classList.add("perfil__campo", "perfil__campo--beetwen");
  pPres.textContent = "Presentación:";
  const spanPres = document.createElement("span");
  spanPres.classList.add("perfil__valor");
  spanPres.id = "presentacion-medicamento-info";
  spanPres.textContent = capitalizarPrimeraLetra(medicamento.presentacion);
  pPres.appendChild(spanPres);

  // Ensamblar los campos en el contenedor
  contDatos.appendChild(pUso);
  contDatos.appendChild(pVia);
  contDatos.appendChild(pPres);

  // Agregar el contenedor de datos a la tarjeta
  card.appendChild(contDatos);

  return card;
}
