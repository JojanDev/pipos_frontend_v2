import { error } from "./alertas";
import { isAuth } from "./auth";

export const url = "http://localhost:3000/pipos_api/";

export const get = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "GET",
    credentials: "include", // Incluye cookies de sesión/autenticación
    headers: {
      "Content-Type": "application/json",
    },
  });
  const datos = await respuesta.json();
  if (!datos.success && datos.code == 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      const logout = await get(`auth/logout`);
      console.log(logout);
      location.hash = "#/login";
      return;
    } else {
      await get(endpoint);
    }
  } else if (!datos.success && datos.code == 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta acción";
    }
  }
  return datos;
};

export const post = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objeto),
  });
  const datos = await respuesta.json();
  if (!datos.success && datos.code == 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      const logout = await get(`auth/logout`);
      console.log(logout);
      location.hash = "#/login";
      return;
    } else {
      await post(endpoint, objeto);
    }
  } else if (!datos.success && datos.code == 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta acción";
    }
  }
  return datos;
};

export const put = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objeto),
  });
  const datos = await respuesta.json();
  if (!datos.success && datos.code == 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      const logout = await get(`auth/logout`);
      console.log(logout);
      location.hash = "#/login";
      return;
    } else {
      await put(endpoint, objeto);
    }
  } else if (!datos.success && datos.code == 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta acción";
    }
  }
  return datos;
};

export const patch = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objeto),
  });
  const datos = await respuesta.json();
  if (!datos.success && datos.code == 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      const logout = await get(`auth/logout`);
      console.log(logout);
      location.hash = "#/login";
      return;
    } else {
      await patch(endpoint, objeto);
    }
  } else if (!datos.success && datos.code == 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta acción";
    }
  }
  return datos;
};

export const del = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const datos = await respuesta.json();
  if (!datos.success && datos.code == 401) {
    if (!(await isAuth())) {
      await error(datos.message);
      const logout = await get(`auth/logout`);
      console.log(logout);
      location.hash = "#/login";
      return;
    } else {
      await del(endpoint);
    }
  } else if (!datos.success && datos.code == 403) {
    if (await isAuth()) {
      datos.message = "No posee permisos para realizar esta acción";
    }
  }
  return datos;
};
