import { renderView } from "../helpers/renderView";
import { routes } from "./routes";

//Prueba
// localStorage.setItem("isAuthenticated", "true");
//

// localStorage.removeItem("isAuthenticated");

const app = document.querySelector("#app");
let layoutActual = null;

export const router = async () => {
  const hast = location.hash.slice(2);
  const [ruta, parametros] = recorrerRutas(routes, hast);

  const auth = isAuthenticated();

  // Si la ruta es privada y NO está logueado => redirige a login
  if (ruta.private && !auth) {
    location.hash = "#/login";
    return;
  }

  //Si no tiene layout, la vista se carga
  if (!ruta.layout) {
    layoutActual = null;
    await cargarVista(ruta.path, app);
  } else {
    //La ruta TIENE layout

    //Si no hay layout cargado o es diferente
    if (layoutActual != ruta.layout) {
      layoutActual = ruta.layout;
      renderView(app, ruta.layout);
      await cargarVistaEnLayout(ruta.path, ruta.slot);
    } else {
      await cargarVistaEnLayout(ruta.path, ruta.slot);
    }
  }

  await ruta.controller(parametros);
};

const recorrerRutas = (routes, hast) => {
  //Convierte el hast a un array separado por los /, eliminando la primera posicion que es una cadena vacia
  let arrayHash = hast.split("/");
  let parametros = {};

  if (arrayHash.length == 3) {
    let parametrosSeparados = arrayHash[2].split("&");

    parametrosSeparados.forEach((parametro) => {
      let claveValor = parametro.split("=");

      parametros[claveValor[0]] = claveValor[1];
      arrayHash.pop();
    });
  }

  let rutaEncontrada = false;
  let rutaActual = routes;

  arrayHash.forEach((segmento, index) => {
    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;
    } else rutaEncontrada = false;

    if (esGrupoRutas(rutaActual)) {
      if (rutaActual["/"] && index == arrayHash.length - 1) {
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      } else rutaEncontrada = false;
    }
  });

  if (rutaEncontrada) {
    return [rutaActual, parametros];
  }
  return [isAuthenticated() ? routes.inicio : routes.login, parametros];
};

const cargarVista = async (path, elemento) => {
  const section = await fetch(`./src/views/${path}`);
  elemento.innerHTML = await section.text();
};

const cargarVistaEnLayout = async (vistaPath, slotName = "main") => {
  const slot = document.querySelector(`[data-slot="${slotName}"]`);
  if (!slot)
    throw new Error(`No se encontró el slot "${slotName}" en el layout actual`);

  const response = await fetch(`./src/views/${vistaPath}`);
  const html = await response.text();

  slot.innerHTML = html;
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
