const url = 'http://localhost:3000/api/';

export const get = async (endpoint) => {
  const respuesta = await fetch(url + endpoint);
  const datos = await respuesta.json();
  if (!respuesta.ok) console.warn(datos.message);

  return datos;
}

export const post = async (endpoint, objeto) => {
  return await fetch(url + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objeto)
  });
}

export const put = async (endpoint, objeto) => {
  return await fetch(url + endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objeto)
  });
}

export const del = async (endpoint) => {
  return await fetch(url + endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}