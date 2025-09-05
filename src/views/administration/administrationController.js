import {
  capitalizarPrimeraLetra,
  convertirADiaMesAño,
  crearFila,
  DOMSelector,
  formatearPrecioConPuntos,
  get,
} from "../../helpers";

export let especiesConRazas = [];

export const listarTiposProductos = async () => {
  const response = await get("tipos-productos");
  const tbody = DOMSelector("#productsTypes .table__body");
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
  const tbody = DOMSelector("#species .table__body");
  tbody.innerHTML = "";

  const razasTbody = DOMSelector("#breeds .table__body");
  const btnRegistrarRaza = DOMSelector("#btn-registro-raza");
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

  especiesConRazas = await Promise.all(
    response.data.map(async (especie) => {
      const razasEspecie = await get(`razas/especie/${especie.id}`);
      return { ...especie, razas: razasEspecie.data };
    })
  );

  especiesConRazas.forEach((especie) => {
    // cont;
    const btn = document.createElement("button");
    const i = document.createElement("i");
    btn.append(i);
    // btn.textContent = "Editar";
    i.classList.add("ri-eye-line");
    btn.classList.add("btn", "btn--edit", "fw-400");

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
    const especieSeleccionada = DOMSelector(".table__row--selected");
    const idEspecie = especieSeleccionada?.children[0]?.textContent?.trim();

    if (idEspecie) {
      // window.location.hash = `#/administrar-datos/especies/id=${idEspecie}/razas/crear`;
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

export const cargarRazasDeEspecie = (especie) => {
  const razasTbody = DOMSelector("#breeds .table__body");
  razasTbody.innerHTML = "";

  if (!especie.razas || especie.razas.length === 0) {
    mostrarMensajePlaceholderRazas(
      "No hay razas registradas para esta especie"
    );
    return;
  }
  console.log(especie);

  especie.razas.forEach((raza) => {
    console.log(raza);

    const row = crearFila([raza.id, raza.nombre]);
    razasTbody.append(row);
  });
};

const mostrarMensajePlaceholderRazas = (mensaje) => {
  const razasTbody = DOMSelector("#breeds .table__body");
  razasTbody.innerHTML = "";
  const placeholder = document.createElement("p");
  placeholder.classList.add("placeholder");
  placeholder.textContent = mensaje;
  razasTbody.append(placeholder);
};

export const administrationController = () => {
  listarTiposProductos();
  listarEspecies();

  const tablaRazas = DOMSelector("#breeds");

  // const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  // console.log(acciones);


  // for (const accion of acciones) {
  //   console.log(accion.dataset.permiso.split(","));
  //   console.log(hasPermission(accion.dataset.permiso.split(",")));
  //   if (!hasPermission(accion.dataset.permiso.split(","))) {
  //     accion.remove();
  //   }
  // }

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

  const tablaEspecies = DOMSelector("#species");

  tablaEspecies.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    const btn = event.target.closest(".btn--edit");

    if (btn) {
      const idEspecie = fila.getAttribute("data-id");

      // location.hash = `#/administrar_datos/especies/perfil/id=${idEspecie}`;
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `especies/perfil/id=${idEspecie}`
          : `/especies/perfil/id=${idEspecie}`);
    }
  });

  const tablaTipoProducto = DOMSelector("#productsTypes");

  tablaTipoProducto.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");

    if (fila) {
      const idTipo = fila.getAttribute("data-id");

      // location.hash = `#/administrar_datos/tipos_productosPerfil/id=${idTipo}`;
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `tipos-productos/perfil/id=${idTipo}`
          : `/tipos-productos/perfil/id=${idTipo}`);
    }
  });
};
