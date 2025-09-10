// API helper functions: GET, POST, PUT, PATCH y DELETE con manejo de autenticación y permisos.
import { error } from "./alertas";
import { isAuth } from "./auth";

// URL base de la API
export const url = "http://localhost:3000/pipos_api/";

/**
 * Realiza una petición GET al endpoint indicado.
 * Incluye cookies de sesión y controla errores de autenticación y autorización.
 *
 * @param {string} endpoint - Ruta relativa al recurso en la API.
 * @returns {Promise<Object>} Respuesta parseada en JSON desde el servidor.
 */
export const get = async (endpoint) => {
  // Ejecutar la petición GET con credenciales
  const respuesta = await fetch(url + endpoint, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  // Parsear la respuesta
  const datos = await respuesta.json();

  // Manejo de error 401 (no autenticado)
  if (!datos.success && datos.code === 401) {
    const auth = await isAuth();
    if (!auth) {
      await error(datos.message);
      await get("auth/logout");
      location.hash = "#/login";
      return;
    }
    // Reintentar la misma petición si sigue autenticado
    return await get(endpoint);
  }

  // Manejo de error 403 (sin permisos)
  if (!datos.success && datos.code === 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta accion";
    }
  }

  return datos;
};

/**
 * Realiza una petición POST al endpoint indicado.
 * Envía un objeto JSON en el cuerpo y maneja errores de autenticación y permisos.
 *
 * @param {string} endpoint - Ruta relativa al recurso en la API.
 * @param {Object} objeto   - Datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} Respuesta parseada en JSON desde el servidor.
 */
export const post = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(objeto),
  });

  const datos = await respuesta.json();

  if (!datos.success && datos.code === 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      await get("auth/logout");
      location.hash = "#/login";
      return;
    }
    return await post(endpoint, objeto);
  }

  if (!datos.success && datos.code === 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta accion";
    }
  }

  return datos;
};

/**
 * Realiza una petición PUT al endpoint indicado.
 * Envía un objeto JSON en el cuerpo y maneja errores de autenticación y permisos.
 *
 * @param {string} endpoint - Ruta relativa al recurso en la API.
 * @param {Object} objeto   - Datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} Respuesta parseada en JSON desde el servidor.
 */
export const put = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(objeto),
  });

  const datos = await respuesta.json();

  if (!datos.success && datos.code === 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      await get("auth/logout");
      location.hash = "#/login";
      return;
    }
    return await put(endpoint, objeto);
  }

  if (!datos.success && datos.code === 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta accion";
    }
  }

  return datos;
};

/**
 * Realiza una petición PATCH al endpoint indicado.
 * Envía un objeto JSON en el cuerpo y maneja errores de autenticación y permisos.
 *
 * @param {string} endpoint - Ruta relativa al recurso en la API.
 * @param {Object} objeto   - Datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} Respuesta parseada en JSON desde el servidor.
 */
export const patch = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(objeto),
  });

  const datos = await respuesta.json();

  if (!datos.success && datos.code === 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      await get("auth/logout");
      location.hash = "#/login";
      return;
    }
    return await patch(endpoint, objeto);
  }

  if (!datos.success && datos.code === 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta accion";
    }
  }

  return datos;
};

/**
 * Realiza una petición DELETE al endpoint indicado.
 * Maneja errores de autenticación y permisos.
 *
 * @param {string} endpoint - Ruta relativa al recurso en la API.
 * @returns {Promise<Object>} Respuesta parseada en JSON desde el servidor.
 */
export const del = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const datos = await respuesta.json();

  if (!datos.success && datos.code === 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      await get("auth/logout");
      location.hash = "#/login";
      return;
    }
    return await del(endpoint);
  }

  if (!datos.success && datos.code === 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta accion";
    }
  }

  return datos;
};
