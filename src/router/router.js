import { DOMSelector } from "../helpers";
import { renderLayout } from "../helpers/renderView";
import { routes } from "./routes";

const app = document.querySelector("#app");
let layoutActual = null;

export const router = async () => {
  const hash = location.hash.slice(2);
  console.log("hash:", hash);
  const arrayHash = hash.split("/"); // Separa el hash por /
  console.log("arrayHash:", arrayHash);

  // const [ruta, parametros] = recorrerRutas(routes, arrayHash); // ✅ Ahora recibimos también la clave base
  // const auth = isAuthenticated();

  const hashSinParams = arrayHash.filter((item) => !item.includes("="));

  const indexSegBase = obtenerIndexSegmentoBase(hashSinParams);
  console.log("indexSegBase:", indexSegBase);

  if (indexSegBase == null) {
    console.log("redireccionado a inicio");
    return (location.hash = "#/inicio" || "#/login");
  }
  // mascotas/perfil/1/antecedente/1/tratamiento/crear
  // console.log("arrayHash:", arrayHash);

  const hashBase = arrayHash.slice(0, indexSegBase + 1);
  // console.log("hashBase:", hashBase);
  arrayHash.splice(0, indexSegBase + 1, hashBase);
  // [[mascotas, perfil],id =  1, antecedente, 1, tratamiento, crear]
  // console.log("hashUtil:", hashUtil);
  // console.log("arrayHash:", arrayHash);

  let parametros = {};
  for (let index = 1; index <= arrayHash.length; index++) {
    // console.log("hashBase:", hashBase);
    const ruta = obtenerRuta(hashBase);

    // console.log("ruta:", ruta);

    // console.log(
    //   "hashBase[hashBase.length - 1]:",
    //   hashBase[hashBase.length - 1]
    // );

    // console.log("arrayHash:", arrayHash);
    // console.log("index:", index);

    // console.log("arrayHash[index]:", arrayHash[index]);


    if (arrayHash[index] && arrayHash[index].includes("=")) {
      const parametrosSeparados = arrayHash[index].split("&");
      let objetoParametros = {};
      parametrosSeparados.forEach((param) => {
        const [clave, valor] = param.split("=");
        objetoParametros[clave] = valor ? decodeURIComponent(valor) : "";
      });
      console.log("index:", index);
      console.log("arrayHash[index]:", arrayHash[index]);

      console.log(arrayHash);
      console.log("objetoParametros:", objetoParametros);

      parametros[`${hashBase[hashBase.length - 1]}`] = objetoParametros;
      console.log("parametros:", parametros);

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
    console.log("parametros:", parametros);

    console.log("vistaCargada:", vistaCargada);

    if (vistaCargada) continue;

    if (ruta == null) continue;
    await cargarVistaEnLayout(ruta.path, hashSinParams.join("/"), ruta.addHtml);
    await ruta.controller(parametros);
  }
  // hashUtil.forEach((segmento) => {
  //   const ruta = obtenerRuta(segmento);
  // });

  // let claveBase = null; // ← ✅ Variable para guardar la clave base

  //mascotas/perfil/id=1/antecedente/id=1/tratamiento/crear

  // if (!ruta) {
  //   location.hash = auth ? "#/inicio" : "#/login";
  //   return;
  // }

  // // Si la ruta es privada y no está autenticado
  // if (ruta.private && !auth) {
  //   location.hash = "#/login";
  //   return;
  // }

  // if (!ruta.private) {
  //   layoutActual = false;
  //   // Dependiendo de tu renderLayout, puede que quieras vaciar #app:
  //   app.innerHTML = "";
  // }

  // if (ruta.addHtml) {
  //   const hashBase = arrayHash.splice(
  //     arrayHash[arrayHash.length - 1].includes("=") ? -2 : -1
  //   );

  //   const rutasRecorridas = [];

  //   if (!layoutActual || hashBase.join("/") !== hash) {
  //     //Mal hashbase
  //     layoutActual = true;
  //     await renderLayout();

  //     hashBase.forEach(async (segmento, index) => {
  //       if (segmento.includes("=")) return;

  //       rutasRecorridas.push(segmento);

  //       if (hashBase[index + 1].includes("=")) {
  //         rutasRecorridas.push(segmento);
  //       }

  //       const [rutaAnterior, parametrosAnterior] = recorrerRutas(
  //         routes,
  //         rutasRecorridas
  //       ); // ✅ Ahora recibimos también la clave base
  //       if (!rutaAnterior) return;

  //       await cargarVistaEnLayout(
  //         rutaAnterior.path,
  //         "main",
  //         rutaAnterior.addHtml
  //       );
  //       await rutaAnterior.controller(parametrosAnterior);
  //     });
  //   }
  //   await cargarVistaEnLayout(ruta.path, "main", ruta.addHtml);
  //   await ruta.controller(parametros);
  // }

  // Ruta con vista encima (modal, addHtml)
  // if (ruta.addHtml) {
  //   const baseHash = sessionStorage.getItem("vistaBase");

  //   if (!layoutActual || (baseHash && baseHash !== hash)) {
  //     const [rutaBase, parametrosBase, claveBaseVista] = recorrerRutas(
  //       routes,
  //       baseHash || ""
  //     ); // ✅ También obtenemos la clave base de la vista base

  //     if (!rutaBase || !rutaBase.layout || !rutaBase.path) {
  //       console.warn("No se pudo restaurar la vista base:", baseHash);
  //       location.hash = "#/inicio";
  //       return;
  //     }

  //     // Si el layout no es el actual, lo cargamos
  //     if (layoutActual !== rutaBase.layout) {
  //       layoutActual = rutaBase.layout;
  //       await renderLayout(app, rutaBase.layout);
  //     }

  //     const slot = document.querySelector(
  //       `[data-slot="${rutaBase.slot || "main"}"]`
  //     );

  //     const vistaYaCargada =
  //       slot?.getAttribute("data-vista-base") === claveBaseVista; // ✅ Comparamos contra la clave base

  //     if (!vistaYaCargada) {
  //       await cargarVistaEnLayout(rutaBase.path, rutaBase.slot);
  //       slot?.setAttribute("data-vista-base", claveBaseVista); // ✅ Asignamos la clave base, no el path
  //       await rutaBase.controller(parametrosBase);
  //     }
  //   }

  //   // Insertamos la nueva vista encima
  //   await cargarVistaEnLayout(ruta.path, ruta.slot, true);
  // }

  // // Ruta normal con layout
  // else if (ruta.layout) {
  //   if (layoutActual !== ruta.layout) {
  //     layoutActual = ruta.layout;
  //     await renderLayout(app, ruta.layout);
  //   }

  //   await cargarVistaEnLayout(ruta.path, ruta.slot);

  //   const slot = document.querySelector(`[data-slot="${ruta.slot || "main"}"]`);

  //   slot?.setAttribute("data-vista-base", claveBase); // ✅ Usamos la clave base como identificador único

  //   actualizarVistaBase(ruta);
  // }

  // // Ruta sin layout (ej: login)
  // else {
  //   layoutActual = null;
  //   await cargarVista(ruta.path, app);
  //   actualizarVistaBase(ruta);
  // }

  // await ruta.controller(parametros);
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
