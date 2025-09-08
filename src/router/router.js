import { DOMSelector, get, isAuth } from "../helpers";
import hasPermission from "../helpers/hasPermission";
import { renderLayout, renderNotFound } from "../helpers/renderView";
import { routes } from "./routes";

const app = document.querySelector("#app");
let layoutActual = null;

export const router = async () => {
  const hash = location.hash.slice(2);
  console.log("hash:", hash);
  const arrayHash = hash.split("/");
  console.log("arrayHash:", arrayHash);

  const hashSinParams = arrayHash.filter((item) => !item.includes("="));

  const indexSegBase = obtenerIndexSegmentoBase(hashSinParams);
  console.log("indexSegBase:", indexSegBase);

  if (indexSegBase == null) {
    console.log("redireccionado a inicio");
    const login = obtenerRuta(["login"]);
    const response = await fetch(`./src/views/${login.path}`);
    const html = await response.text();
    DOMSelector("#app").innerHTML = html;
    login.controller();
    return;
  }

  const ruta = obtenerRuta(arrayHash);

  if (ruta && ruta.private && !(await isAuth())) {
    const logout = await get(`auth/logout`);
    console.log(logout);
    location.hash = "#/login";
    return;
  }

  if (ruta && ruta.can && !hasPermission(ruta.can))
    return await renderNotFound();

  const hashBase = arrayHash.slice(0, indexSegBase + 1);
  arrayHash.splice(0, indexSegBase + 1, hashBase);

  let parametros = {};
  for (let index = 1; index <= arrayHash.length; index++) {
    const ruta = obtenerRuta(hashBase);

    if (arrayHash[index] && arrayHash[index].includes("=")) {
      const parametrosSeparados = arrayHash[index].split("&");
      let objetoParametros = {};
      parametrosSeparados.forEach((param) => {
        const [clave, valor] = param.split("=");
        objetoParametros[clave] = valor ? decodeURIComponent(valor) : "";
      });
      parametros[`${hashBase[hashBase.length - 1]}`] = objetoParametros;
    }

    const hashSinParams = hashBase.filter((item) => !item.includes("="));
    const vistaCargada = DOMSelector(
      `[data-route="${hashSinParams.join("/")}"]`
    );
    hashBase.push(arrayHash[index]);

    if (ruta && ruta.needLayout) {
      const layoutCargado = DOMSelector("#layout");
      if (!layoutCargado) {
        await renderLayout();
      }
    }

    if (vistaCargada) continue;

    if (ruta == null) continue;
    await cargarVistaEnLayout(ruta.path, hashSinParams.join("/"), ruta.addHtml);
    await ruta.controller(parametros);
  }
};

const obtenerIndexSegmentoBase = (arrayHash) => {
  let segmentoBase = null;
  let rutaActual = routes;
  let rutaEncontrada = false;
  let rutaBase = null;
  // mascotas/perfil/1/antecedente/1/tratamiento/crear
  arrayHash.forEach((segmento, index) => {
    if (segmento.includes("=")) return;

    if (rutaActual[segmento]) {
      //mascotas
      rutaActual = rutaActual[segmento]; //mascotas
      rutaEncontrada = true;
    } else {
      rutaEncontrada = false;
    }

    console.log("rutaActual:", rutaActual);

    //Mascotas = true;
    if (
      (rutaActual["/"] && rutaActual["/"].needLayout) ||
      rutaActual.needLayout
    ) {
      // rutaBase = rutaActual["/"];
      segmentoBase = index;
    }
    if (esGrupoRutas(rutaActual)) {
      // Si es un CRUD
      //Guardamos la vista base si no hay mas segmentos
      // if (rutaActual["/"] && index === arrayHash.length - 1) {
      //   //Si es mascotas/ se muestra la ruta ["/"]
      //   rutaActual = rutaActual["/"];
      //   rutaEncontrada = true;
      // } else {
      //   rutaEncontrada = false;
      // }
    }

    // if (rutaEncontrada && rutaActual.needLayout) {
    //   segmentoBase = index;
    // }
  });
  return segmentoBase;
};

const obtenerRuta = (arrayHash) => {
  let rutaActual = routes;
  let rutaEncontrada = false;

  arrayHash.forEach((segmento, index) => {
    if (segmento.includes("=")) return;

    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;
    } else {
      rutaEncontrada = false;
    }

    if (esGrupoRutas(rutaActual)) {
      if (rutaActual["/"] && index === arrayHash.length - 1) {
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      } else {
        rutaEncontrada = false;
      }
    }
  });

  if (rutaEncontrada) {
    return rutaActual;
  }

  return null;
};

const recorrerRutas = (routes, arrayHash) => {
  let parametros = {};

  if (arrayHash[arrayHash.length - 1].includes("=")) {
    const parametrosSeparados = arrayHash[arrayHash.length - 1].split("&");

    parametrosSeparados.forEach((param) => {
      const [clave, valor] = param.split("=");
      parametros[clave] = valor ? decodeURIComponent(valor) : "";
    });

    arrayHash.pop(); // Quitamos los parámetros
  }

  let rutaActual = routes;
  let rutaEncontrada = false;
  // let claveBase = null; // ← ✅ Variable para guardar la clave base

  arrayHash.forEach((segmento, index) => {
    if (segmento.includes("=")) return;

    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento]; //Si la ruta existe se convierte en la actual
      rutaEncontrada = true;

      // if (index === 0) {
      //   claveBase = segmento; // ← ✅ Guardamos la primera clave (base)
      // }
    } else {
      rutaEncontrada = false;
    }

    if (esGrupoRutas(rutaActual)) {
      // Si es un CRUD
      if (rutaActual["/"] && index === arrayHash.length - 1) {
        //Si es mascotas/ se muestra la ruta ["/"]
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      } else {
        rutaEncontrada = false;
      }
    }
  });

  if (rutaEncontrada) {
    return [rutaActual, parametros]; // ← ✅ Ahora también retornamos la clave base
  }
  return [null, null];
  // const rutaFallback = isAuthenticated() ? routes.inicio : routes.login;
  // const claveFallback = isAuthenticated() ? "inicio" : "login"; // ← ✅ Por si hay que retornar fallback
  // return [rutaFallback, parametros, claveFallback];
};

const cargarVista = async (path, elemento) => {
  const section = await fetch(`./src/views/${path}`);
  elemento.innerHTML = await section.text();
};

const cargarVistaEnLayout = async (
  vistaPath,
  route,
  // slotName = "main",
  append = false
) => {
  const slot = document.querySelector(`[data-slot="main"]`);
  if (!slot)
    throw new Error(`No se encontró el slot "${slotName}" en el layout actual`);

  const response = await fetch(`./src/views/${vistaPath}`);
  const html = await response.text();
  // console.log("HTML recibido:", JSON.stringify(html));

  // 1. Parsear en un template
  const template = document.createElement("template");
  template.innerHTML = html.trim();

  // 2. Extraer el elemento raíz de tu vista
  // const rootNode = template.content.firstElementChild;
  const rootNode = Array.from(template.content.childNodes).find(
    (node) =>
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName.toLowerCase() !== "script"
  );
  if (!rootNode) throw new Error("La vista debe tener un nodo raíz");

  // 3. Añadir data-route directamente
  rootNode.setAttribute("data-route", route);

  // 4. Insertar en el slot
  if (append) {
    slot.appendChild(rootNode);
  } else {
    slot.innerHTML = "";
    slot.appendChild(rootNode);
  }
};

const esGrupoRutas = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] !== "object" || obj[key] === null) {
      return false;
    }
  }
  return true;
};

const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

const actualizarVistaBase = (ruta) => {
  if (ruta.layout) {
    sessionStorage.setItem("vistaBase", location.hash.slice(2));
  } else if (!ruta.addHtml) {
    sessionStorage.removeItem("vistaBase");
  }
};
