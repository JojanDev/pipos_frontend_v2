import { renderLayout } from "../helpers/renderView";
import { routes } from "./routes";

const app = document.querySelector("#app");
let layoutActual = null;

export const router = async () => {
  console.log("ADIOS");

  const hash = location.hash.slice(2);
  const [ruta, parametros, claveBase] = recorrerRutas(routes, hash); // ✅ Ahora recibimos también la clave base
  const auth = isAuthenticated();

  if (!ruta) {
    location.hash = auth ? "#/inicio" : "#/login";
    return;
  }

  // Si la ruta es privada y no está autenticado
  if (ruta.private && !auth) {
    location.hash = "#/login";
    return;
  }

  // Ruta con vista encima (modal, addHtml)
  if (ruta.addHtml) {
    const baseHash = sessionStorage.getItem("vistaBase");

    if (!layoutActual || (baseHash && baseHash !== hash)) {
      const [rutaBase, parametrosBase, claveBaseVista] = recorrerRutas(
        routes,
        baseHash || ""
      ); // ✅ También obtenemos la clave base de la vista base

      if (!rutaBase || !rutaBase.layout || !rutaBase.path) {
        console.warn("No se pudo restaurar la vista base:", baseHash);
        location.hash = "#/inicio";
        return;
      }

      // Si el layout no es el actual, lo cargamos
      if (layoutActual !== rutaBase.layout) {
        layoutActual = rutaBase.layout;
        await renderLayout(app, rutaBase.layout);
      }

      const slot = document.querySelector(
        `[data-slot="${rutaBase.slot || "main"}"]`
      );

      const vistaYaCargada =
        slot?.getAttribute("data-vista-base") === claveBaseVista; // ✅ Comparamos contra la clave base

      if (!vistaYaCargada) {
        await cargarVistaEnLayout(rutaBase.path, rutaBase.slot);
        slot?.setAttribute("data-vista-base", claveBaseVista); // ✅ Asignamos la clave base, no el path
        await rutaBase.controller(parametrosBase);
      }
    }

    // Insertamos la nueva vista encima
    await cargarVistaEnLayout(ruta.path, ruta.slot, true);
  }

  // Ruta normal con layout
  else if (ruta.layout) {
    if (layoutActual !== ruta.layout) {
      layoutActual = ruta.layout;
      await renderLayout(app, ruta.layout);
    }

    await cargarVistaEnLayout(ruta.path, ruta.slot);

    const slot = document.querySelector(`[data-slot="${ruta.slot || "main"}"]`);

    slot?.setAttribute("data-vista-base", claveBase); // ✅ Usamos la clave base como identificador único

    actualizarVistaBase(ruta);
  }

  // Ruta sin layout (ej: login)
  else {
    layoutActual = null;
    await cargarVista(ruta.path, app);
    actualizarVistaBase(ruta);
  }

  await ruta.controller(parametros);
};

const recorrerRutas = (routes, hash) => {
  const arrayHash = hash.split("/");
  let parametros = {};

  if (arrayHash.length === 3) {
    const parametrosSeparados = arrayHash[2].split("&");

    parametrosSeparados.forEach((param) => {
      const [clave, valor] = param.split("=");
      parametros[clave] = valor.includes("%20")
        ? valor.replace(/%20/g, " ")
        : valor;
    });

    arrayHash.pop(); // Quitamos los parámetros
  }

  console.log("parametros", parametros);

  let rutaActual = routes;
  let rutaEncontrada = false;
  let claveBase = null; // ← ✅ Variable para guardar la clave base

  arrayHash.forEach((segmento, index) => {
    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;

      if (index === 0) {
        claveBase = segmento; // ← ✅ Guardamos la primera clave (base)
      }
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
    return [rutaActual, parametros, claveBase]; // ← ✅ Ahora también retornamos la clave base
  }

  const rutaFallback = isAuthenticated() ? routes.inicio : routes.login;
  const claveFallback = isAuthenticated() ? "inicio" : "login"; // ← ✅ Por si hay que retornar fallback
  return [rutaFallback, parametros, claveFallback];
};

const cargarVista = async (path, elemento) => {
  const section = await fetch(`./src/views/${path}`);
  elemento.innerHTML = await section.text();
};

const cargarVistaEnLayout = async (
  vistaPath,
  slotName = "main",
  append = false
) => {
  const slot = document.querySelector(`[data-slot="${slotName}"]`);
  if (!slot)
    throw new Error(`No se encontró el slot "${slotName}" en el layout actual`);

  const response = await fetch(`./src/views/${vistaPath}`);
  const html = await response.text();

  if (append) {
    slot.insertAdjacentHTML("beforeend", html); // Agrega al contenido existente
  } else {
    slot.innerHTML = html; // Reemplaza el contenido completamente
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

// const waitForSlot = (slotName, timeout = 1000) => {
//   return new Promise((resolve, reject) => {
//     const start = Date.now();

//     const check = () => {
//       const slot = document.querySelector(`[data-slot="${slotName}"]`);
//       if (slot) return resolve(slot);

//       if (Date.now() - start > timeout) {
//         return reject(new Error(`Timeout esperando el slot "${slotName}"`));
//       }

//       requestAnimationFrame(check);
//     };

//     check();
//   });
// };

const actualizarVistaBase = (ruta) => {
  if (ruta.layout) {
    sessionStorage.setItem("vistaBase", location.hash.slice(2));
  } else if (!ruta.addHtml) {
    sessionStorage.removeItem("vistaBase");
  }
};
