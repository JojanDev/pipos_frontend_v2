import {
  del,
  DOMSelector,
  error,
  formatearPrecioConPuntos,
  get,
  success,
} from "../../helpers";

export const crearCardServicio = (id, nombre, descripcion, precio) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = id;

  const imagen = document.createElement("img");
  imagen.src = "../../../public/logoService.png";
  imagen.alt = "";
  imagen.classList.add("card__img");

  const precioP = document.createElement("p");
  precioP.classList.add("card__precio");
  precioP.textContent = "Valor: " + formatearPrecioConPuntos(precio);

  const contenido = document.createElement("div");
  contenido.classList.add("scroll-cont");

  const tituloElemento = document.createElement("h3");
  tituloElemento.classList.add("card__title");
  tituloElemento.textContent = nombre;

  const descripcionElemento = document.createElement("p");
  descripcionElemento.classList.add("card__description");
  descripcionElemento.textContent = descripcion;

  contenido.appendChild(tituloElemento);
  contenido.appendChild(descripcionElemento);

  // Botón editar
  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btn", "btn--edit", "btn-servicio-edit", "admin");
  btnEdit.title = "Editar servicio";

  const iconEdit = document.createElement("i");
  iconEdit.classList.add("ri-edit-box-line");
  btnEdit.appendChild(iconEdit);

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

  const iconDelete = document.createElement("i");
  iconDelete.classList.add("ri-delete-bin-line");
  btnDelete.appendChild(iconDelete);

  card.appendChild(imagen);
  card.appendChild(contenido);
  card.appendChild(precioP);
  card.appendChild(btnEdit);
  // if (data.id_rol == 1) {
  card.appendChild(btnDelete);
  // }

  return card;
};

const mostrarPlaceholderServicios = (contenedor, mensaje) => {
  const placeholder = document.createElement("p");
  placeholder.classList.add("placeholder");
  placeholder.textContent = mensaje;
  contenedor.appendChild(placeholder);
};

const listarServicios = async (contenedor) => {
  contenedor.innerHTML = "";

  const placeholderAnterior = contenedor.querySelector(".placeholder");
  if (placeholderAnterior) placeholderAnterior.remove();

  const response = await get("servicios");

  if (!response.success || response.data.length === 0) {
    mostrarPlaceholderServicios(contenedor, "No hay servicios registrados.");
    return;
  }

  response.data.forEach((servicio) => {
    const card = crearCardServicio(
      servicio.id,
      servicio.nombre,
      servicio.descripcion,
      servicio.precio
    );
    contenedor.appendChild(card);
  });
};

export const servicesController = async () => {
  const contenedorServicios = DOMSelector("#services");
  await listarServicios(contenedorServicios);

  // const dataJSON = localStorage.getItem("data");
  // const data = JSON.parse(dataJSON);

  // if (data.id_rol != 1) {
  //   const opcionesAdmin = DOMSelectorAll(".admin");
  //   [...opcionesAdmin].forEach((element) => {
  //     element.remove();
  //   });
  // }

  contenedorServicios.addEventListener("click", async (event) => {
    const card = event.target.closest(".card");
    if (!card) return;

    const idServicio = card.dataset.id;

    if (event.target.closest(".btn-servicio-edit")) {
      location.hash = `#/servicios/editar/id=${idServicio}`;
    }

    if (event.target.closest(".btn-servicio-delete")) {
      const response = await del(`servicios/${idServicio}`);

      if (response.success) {
        await success(response.message);

        // Eliminar la card del DOM
        const cardEliminada = DOMSelector(`.card[data-id="${idServicio}"]`);
        if (cardEliminada) cardEliminada.remove();

        // Si ya no quedan cards, mostrar el placeholder
        const cardsRestantes = contenedorCards.querySelectorAll(".card");
        if (cardsRestantes.length === 0) {
          mostrarPlaceholderServicios(
            contenedorCards,
            "No hay servicios registrados."
          );
        }
      } else {
        await error(response.message);
      }
    }
  });
};
