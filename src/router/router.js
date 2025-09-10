import { DOMSelector, get, isAuth } from "../helpers";
import hasPermission from "../helpers/hasPermission";
import { renderLayout, renderNotFound } from "../helpers/renderView";
import { routes } from "./routes";

/**
 * Controlador de rutas principal de la aplicación.
 *
 * Lee el hash de la URL, determina la ruta a renderizar, valida autenticación
 * y permisos, carga el layout si es necesario y monta la vista correspondiente.
 *
 * @returns {Promise<void>}
 *   No retorna valor; realiza fetch de vistas, modifica el DOM y puede cambiar window.location.hash.
 *
 */
export const router = async () => {
  // Obtenemos la parte del hash tras "#/"
  const hash = location.hash.slice(2);
  console.log("hash:", hash);

  // Separamos por "/" para identificar segmentos y parámetros
  const arrayHash = hash.split("/");
  console.log("arrayHash:", arrayHash);

  // Eliminamos segmentos que contienen "=" para obtener sólo la ruta base
  const hashSinParams = arrayHash.filter((item) => !item.includes("="));

  // Identificamos el índice del último segmento que requiere layout
  const indexSegBase = obtenerIndexSegmentoBase(hashSinParams);
  console.log("indexSegBase:", indexSegBase);

  // Si no hay segmento base válido, redirigimos a login o inicio según auth
  if (indexSegBase == null) {
    if (await isAuth()) {
      location.hash = "#/inicio";
      return;
    } else {
      // Cargamos la vista de login sin layout
      const login = obtenerRuta(["login"]);
      const response = await fetch(`./src/views/${login.path}`);
      const html = await response.text();
      DOMSelector("#app").innerHTML = html;
      login.controller();
      return;
    }
  }

  // Intentamos resolver la ruta completa (incluyendo parámetros)
  const ruta = obtenerRuta(arrayHash);

  // Si la ruta es privada y no hay auth, forzamos logout y redirigimos a login
  if (ruta && ruta.private && !(await isAuth())) {
    await get(`auth/logout`);
    location.hash = "#/login";
    return;
  }

  // Si la ruta exige permisos y el usuario no los tiene, mostramos notFound
  if (ruta && ruta.can && !hasPermission(ruta.can)) {
    await renderNotFound();
    return;
  }

  // Preparamos el fragmento de ruta base para montar la vista
  const hashBase = arrayHash.slice(0, indexSegBase + 1);
  arrayHash.splice(0, indexSegBase + 1, hashBase);

  // Objeto para recolectar parámetros de consulta por sección
  let parametros = {};

  // Iteramos por cada segmento para cargar vistas y controladores
  for (let index = 1; index <= arrayHash.length; index++) {
    const rutaActual = obtenerRuta(hashBase);

    // Si elemento contiene "=", lo interpretamos como parámetros de la sección
    if (arrayHash[index] && arrayHash[index].includes("=")) {
      const pares = arrayHash[index].split("&");
      let objParams = {};
      pares.forEach((param) => {
        const [clave, valor] = param.split("=");
        objParams[clave] = valor ? decodeURIComponent(valor) : "";
      });
      parametros[hashBase[hashBase.length - 1]] = objParams;
    }

    // Identificamos la vista ya montada en el DOM
    const rutaSinParams = hashBase.filter((item) => !item.includes("="));
    const vistaCargada = DOMSelector(
      `[data-route="${rutaSinParams.join("")}"]`
    );

    // Avanzamos al siguiente segmento para futuras iteraciones
    hashBase.push(arrayHash[index]);

    // Si la ruta requiere layout y aún no está presente, lo renderizamos
    if (rutaActual && rutaActual.needLayout) {
      const layoutCargado = DOMSelector("#layout");
      if (!layoutCargado) {
        await renderLayout();
      }
    }
    console.log(vistaCargada);

    // Si la vista ya existe, continuamos sin volver a cargar
    if (vistaCargada) continue;

    // Si no existe ruta definida, ignoramos y continuamos
    if (rutaActual == null) continue;

    // Montamos la vista dentro del layout y ejecutamos su controlador
    await cargarVistaEnLayout(
      rutaActual.path,
      rutaSinParams.join(""),
      rutaActual.addHtml
    );
    await rutaActual.controller(parametros);
  }
};

/**
 * Determina el índice del último segmento de ruta que utiliza layout.
 *
 * @param {string[]} arrayHash - Array de segmentos de la ruta sin parámetros.
 * @returns {number|null}
 *   Índice del segmento base donde aplicar layout, o null si no se encontró.
 */
const obtenerIndexSegmentoBase = (arrayHash) => {
  let segmentoBase = null;
  let nodoRuta = routes;

  arrayHash.forEach((segmento, index) => {
    if (segmento.includes("=")) return;

    // Avanzamos por el árbol de rutas
    if (nodoRuta[segmento]) {
      nodoRuta = nodoRuta[segmento];
    } else {
      return;
    }

    // Si el nodo actual o su "/" interno exige layout, actualizamos el índice
    if ((nodoRuta["/"] && nodoRuta["/"].needLayout) || nodoRuta.needLayout) {
      segmentoBase = index;
    }
  });

  return segmentoBase;
};

/**
 * Busca la definición de ruta según segmentos de hash.
 *
 * @param {string[]} arrayHash - Array de segmentos de ruta (incluyendo parámetros).
 * @returns {object|null}
 *   Objeto de ruta definido en routes, o null si no existe.
 */
const obtenerRuta = (arrayHash) => {
  let nodoRuta = routes;
  let rutaEncontrada = false;

  arrayHash.forEach((segmento, idx) => {
    if (segmento.includes("=")) return;

    // Avanzamos por la propiedad que coincide con el segmento
    if (nodoRuta[segmento]) {
      nodoRuta = nodoRuta[segmento];
      rutaEncontrada = true;
    } else {
      rutaEncontrada = false;
    }

    // Si se trata de un grupo de rutas, validamos "/" final
    if (esGrupoRutas(nodoRuta)) {
      if (nodoRuta["/"] && idx === arrayHash.length - 1) {
        nodoRuta = nodoRuta["/"];
        rutaEncontrada = true;
      } else {
        rutaEncontrada = false;
      }
    }
  });

  return rutaEncontrada ? nodoRuta : null;
};

/**
 * Carga el HTML de una vista en el slot principal del layout.
 *
 * @param {string} vistaPath - Ruta al archivo de vista dentro de src/views.
 * @param {string} route - Clave de data-route para el nodo raíz de la vista.
 * @param {boolean} [append=false] - Si es true, agrega; si no, reemplaza el contenido.
 * @returns {Promise<void>}
 *
 * @throws {Error} Si no encuentra el slot en el layout o la vista no contiene nodo raíz.
 */
const cargarVistaEnLayout = async (vistaPath, route, append = false) => {
  // Localizamos el slot de contenido principal en el layout
  const slot = document.querySelector(`[data-slot="main"]`);
  if (!slot) {
    throw new Error(`No se encontró el slot "main" en el layout actual`);
  }

  // Fetch y parse del HTML de la vista
  const response = await fetch(`./src/views/${vistaPath}`);
  const html = await response.text();
  const template = document.createElement("template");
  template.innerHTML = html.trim();

  // Seleccionamos el primer nodo elemento como raíz de la vista
  const rootNode = Array.from(template.content.childNodes).find(
    (node) =>
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName.toLowerCase() !== "script"
  );
  if (!rootNode) {
    throw new Error("La vista debe tener un nodo raíz");
  }

  // Etiquetamos el nodo para futuras referencias
  rootNode.setAttribute("data-route", route);

  // Insertamos el nodo en el slot, reemplazando o agregando según append
  if (append) {
    slot.appendChild(rootNode);
  } else {
    slot.innerHTML = "";
    slot.appendChild(rootNode);
  }
};

/**
 * Determina si un objeto de rutas es un grupo de rutas (sub-árbol).
 *
 * @param {object} obj - Objeto a evaluar.
 * @returns {boolean} True si todas sus propiedades son objetos (grupo), false en caso contrario.
 */
const esGrupoRutas = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] !== "object" || obj[key] === null) {
      return false;
    }
  }
  return true;
};
