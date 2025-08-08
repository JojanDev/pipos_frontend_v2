import {
  capitalizarPrimeraLetra,
  convertirADiaMesAño,
  crearFila,
  formatearPrecioConPuntos,
  get,
} from "../../helpers";

let especiesConRazas = [];

export const listarTiposProductos = async () => {
  const response = await get("tipos-productos");
  const tbody = document.querySelector("#productsTypes .table__body");
  tbody.innerHTML = ""; // Limpia por si se vuelve a cargar

  if (!response.success) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("placeholder");
    placeholder.textContent = "No hay tipos registrados";
    tbody.append(placeholder);
    return;
  }

  response.data.forEach(({ id, nombre }) => {
    const row = crearFila([id, nombre]);
    tbody.append(row);
  });
};

export const listarEspecies = async () => {
  const response = await get("especies");
  const tbody = document.querySelector("#species .table__body");
  tbody.innerHTML = "";

  const razasTbody = document.querySelector("#breeds .table__body");
  const btnRegistrarRaza = document.querySelector("#btn-registro-raza");
  razasTbody.innerHTML = "";

  if (!response.success) {
    const placeholder = document.createElement("p");
    placeholder.classList.add("placeholder");
    placeholder.textContent = "No hay especies registradas";
    tbody.append(placeholder);
    mostrarMensajePlaceholderRazas("Seleccione una especie");
    btnRegistrarRaza.disabled = true;
    return;
  }

  especiesConRazas = response.data;

  especiesConRazas.forEach((especie) => {
    // cont;
    const btn = document.createElement("button");
    const i = document.createElement("i");
    btn.append(i);
    // btn.textContent = "Editar";
    i.classList.add("ri-edit-box-line");
    btn.classList.add("btn", "btn--edit");

    const row = crearFila([especie.id, especie.nombre, btn]);

    row.addEventListener("click", () => {
      tbody
        .querySelectorAll(".table__row")
        .forEach((fila) => fila.classList.remove("table__row--selected"));
      row.classList.add("table__row--selected");

      cargarRazasDeEspecie(especie);
      btnRegistrarRaza.disabled = false;
    });

    tbody.append(row);
  });

  // 👇 Aquí va el evento del botón registrar raza
  btnRegistrarRaza.addEventListener("click", () => {
    const especieSeleccionada = document.querySelector(".table__row--selected");
    const idEspecie = especieSeleccionada?.children[0]?.textContent?.trim();

    if (idEspecie) {
      window.location.hash = `#/administrar_datos/razasCrear/id_especie=${idEspecie}`;
    }
  });

  // Mensaje por defecto si no hay selección
  mostrarMensajePlaceholderRazas("Seleccione una especie");
  btnRegistrarRaza.disabled = true;
};

const cargarRazasDeEspecie = (especie) => {
  const razasTbody = document.querySelector("#breeds .table__body");
  razasTbody.innerHTML = "";

  if (!especie.razas || especie.razas.length === 0) {
    mostrarMensajePlaceholderRazas(
      "No hay razas registradas para esta especie"
    );
    return;
  }

  especie.razas.forEach((raza) => {
    const row = crearFila([raza.id, raza.nombre]);
    razasTbody.append(row);
  });
};

const mostrarMensajePlaceholderRazas = (mensaje) => {
  const razasTbody = document.querySelector("#breeds .table__body");
  razasTbody.innerHTML = "";
  const placeholder = document.createElement("p");
  placeholder.classList.add("placeholder");
  placeholder.textContent = mensaje;
  razasTbody.append(placeholder);
};

export const administrationController = () => {
  listarTiposProductos();
  listarEspecies();

  const tablaRazas = document.querySelector("#breeds");

  tablaRazas.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idRaza = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", idRaza);
      location.hash = `#/administrar_datos/razasPerfil/id=${idRaza}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });

  const tablaEspecies = document.querySelector("#species");

  tablaEspecies.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    const btn = event.target.closest(".btn--edit");

    if (btn) {
      const idEspecie = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", idEspecie);
      location.hash = `#/administrar_datos/especiesPerfil/id=${idEspecie}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }

    // if (fila) {
    //   const idEspecie = fila.getAttribute("data-id");
    //   console.log("Cliente clickeado con ID:", idEspecie);
    //   location.hash = `#/administrar_datos/especiesPerfil/id=${idEspecie}`;

    //   // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
    //   // ejemplo: mostrarDetalleCliente(idCliente);
    // }
  });

  const tablaTipoProducto = document.querySelector("#productsTypes");

  tablaTipoProducto.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idTipo = fila.getAttribute("data-id");
      console.log("Cliente clickeado con ID:", idTipo);
      location.hash = `#/administrar_datos/tipos_productosPerfil/id=${idTipo}`;

      // Aquí puedes llamar a una función para ver más detalles, abrir modal, etc.
      // ejemplo: mostrarDetalleCliente(idCliente);
    }
  });
};
