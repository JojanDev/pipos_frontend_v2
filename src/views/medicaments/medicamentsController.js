import { capitalizarPrimeraLetra, cargarComponente, get } from "../../helpers";
import { routes } from "../../router/routes";

export function crearCartaMedicamento(medicamento) {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  if (data.id_rol != 1) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }
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

  // Botón editar
  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btn", "btn--edit", "btn-servicio-edit");
  btnEdit.id = "#editar-info-medicamento";
  btnEdit.title = "Editar servicio";
  btnEdit.innerHTML = `<i class="ri-edit-box-line"></i>`;

  // Botón eliminar
  const btnDelete = document.createElement("button");
  btnDelete.classList.add(
    "btn",
    "btn--edit",
    "btn--red",
    "btn-servicio-delete",
    "admin"
  );
  btnDelete.title = "Eliminar servicio";
  btnDelete.innerHTML = `<i class="ri-delete-bin-line"></i>`;

  const btns = document.createElement("div");
  btns.classList.add("card__btns");
  // Agregar botones al card
  btns.appendChild(btnEdit);
  if (data.id_rol == 1) {
    btns.appendChild(btnDelete);
  }
  card.appendChild(btns);
  return card;
}

export const medicamentsController = async () => {
  const contenedor = document.querySelector("#medicaments-info");

  const response = await get("medicamentos/info");

  response.data.forEach((medicamento) => {
    const carta = crearCartaMedicamento(medicamento);
    contenedor.appendChild(carta);
  });

  const btnEditInfo = document.querySelector("#medicaments-info");

  btnEditInfo.addEventListener("click", async (event) => {
    const fila = event.target.closest(".card[data-id]");

    if (fila) {
      const id_info = fila.getAttribute("data-id");
      await cargarComponente(routes.medicamentos_info.editar, { id: id_info });
    }
  });
};
