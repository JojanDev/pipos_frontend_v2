import {
  capitalizarPrimeraLetra,
  cargarComponente,
  DOMSelector,
  get,
} from "../../helpers";
import { routes } from "../../router/routes";

export function crearCartaMedicamento(medicamento) {
  // Contenedor principal
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = medicamento.id;

  // Imagen
  const img = document.createElement("img");
  img.src = "../../../public/medicamentosLogo.png";
  img.alt = "";
  img.classList.add("card__img");
  card.appendChild(img);

  // Título
  const title = document.createElement("h3");
  title.classList.add("card__title");
  title.id = "nombre-medicamento-info";
  title.textContent = medicamento.nombre;
  card.appendChild(title);

  // Contenedor de datos
  const contDatos = document.createElement("div");
  contDatos.classList.add(
    "perfil__contenedor-datos-personales",
    "perfil__contenedor-datos-personales--col-1",
    "perfil__contenedor-datos-personales--span2"
  );

  // Campo uso general
  const pUso = document.createElement("p");
  pUso.classList.add("perfil__campo", "perfil__campo--beetwen");
  pUso.textContent = "Uso general";
  const spanUso = document.createElement("span");
  spanUso.classList.add("perfil__valor");
  spanUso.id = "uso-medicamento-info";
  spanUso.textContent = capitalizarPrimeraLetra(medicamento.uso_general);
  pUso.appendChild(spanUso);

  // Campo vía administración
  const pVia = document.createElement("p");
  pVia.classList.add("perfil__campo", "perfil__campo--beetwen");
  pVia.textContent = "Via administracion:";
  const spanVia = document.createElement("span");
  spanVia.classList.add("perfil__valor");
  spanVia.id = "via-medicamento-info";
  spanVia.textContent = capitalizarPrimeraLetra(medicamento.via_administracion);
  pVia.appendChild(spanVia);

  // Campo presentación
  const pPres = document.createElement("p");
  pPres.classList.add("perfil__campo", "perfil__campo--beetwen");
  pPres.textContent = "Presentacion:";
  const spanPres = document.createElement("span");
  spanPres.classList.add("perfil__valor");
  spanPres.id = "presentacion-medicamento-info";
  spanPres.textContent = capitalizarPrimeraLetra(medicamento.presentacion);
  pPres.appendChild(spanPres);

  // Agregar los <p> al contenedor de datos
  contDatos.appendChild(pUso);
  contDatos.appendChild(pVia);
  contDatos.appendChild(pPres);

  // Agregar contenedor al card
  card.appendChild(contDatos);

  return card;
}

export const medicamentsController = async () => {
  const contenedor = DOMSelector("#medicaments-info");

  const response = await get("info-medicamentos");

  response.data.forEach((medicamento) => {
    const carta = crearCartaMedicamento(medicamento);
    contenedor.appendChild(carta);
  });

  const contenedorMedicaments = DOMSelector("#medicaments-info");

  contenedorMedicaments.addEventListener("click", async (event) => {
    const fila = event.target.closest(".card[data-id]");

    if (fila) {
      const id_info = fila.getAttribute("data-id");
      location.hash = (location.hash + (location.hash[location.hash.length - 1] == "/" ? `perfil/id=${id_info}` : `/perfil/id=${id_info}`));
    }
  });
};
