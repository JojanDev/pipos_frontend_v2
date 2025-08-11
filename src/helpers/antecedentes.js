export const crearBloqueAntecedenteCompleto = ({
  id,
  titulo,
  diagnostico,
  fecha_creado,
  tratamientos = [],
  message = "No hay tratamientos registrados",
}) => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);
  console.log(data);

  if (data.id_rol == 2) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }
  const fechaFormateada = convertirADiaMesAño(fecha_creado);

  // 📦 Contenedor principal
  const divAntecedente = document.createElement("div");
  divAntecedente.classList.add("antecedente");
  divAntecedente.setAttribute("data-idAntecendente", id);

  // 🧷 Encabezado
  const divHeader = document.createElement("div");
  divHeader.classList.add("antecedente-header");

  const spanFecha = document.createElement("span");
  spanFecha.textContent = fechaFormateada;

  const spanTitulo = document.createElement("span");
  spanTitulo.textContent = titulo;
  spanTitulo.classList.add("antecedente-titulo");

  const iconDelete = document.createElement("i");
  // spanTitulo.textContent = titulo;
  iconDelete.classList.add(
    "ri-delete-bin-line",
    "delete-antecedent",
    "btn--red",
    "admin"
  );

  divHeader.appendChild(spanFecha);
  divHeader.appendChild(spanTitulo);

  if (data.id_rol == 1) {
    divHeader.appendChild(iconDelete);
  }

  // 📄 Cuerpo
  const divBody = document.createElement("div");
  divBody.classList.add("antecedente-body");

  const pDiagnostico = document.createElement("p");
  pDiagnostico.innerHTML = `<strong>Diagnóstico:</strong> ${diagnostico}`;
  divBody.appendChild(pDiagnostico);

  // 🧩 Separador
  const pSeparador = document.createElement("p");
  pSeparador.classList.add("perfil__separador", "perfil__separador--treatment");
  pSeparador.textContent = "Tratamientos";
  divBody.appendChild(pSeparador);

  // 🔽 Tratamientos o mensaje si no hay
  if (tratamientos.length > 0) {
    tratamientos.forEach((tratamiento) => {
      const divTratamiento = crearElementoTratamiento(tratamiento);
      divBody.appendChild(divTratamiento);
    });
  } else if (message) {
    const mensajeSinTratamientos = document.createElement("p");
    mensajeSinTratamientos.classList.add("mensaje-sin-tratamientos");
    mensajeSinTratamientos.textContent = message;
    divBody.appendChild(mensajeSinTratamientos);
  }

  // 🔘 Botón/ícono para agregar tratamientos (opcional)
  const icono = document.createElement("i");
  icono.classList.add("ri-add-line", "plus-icon");
  icono.setAttribute("id", "register-treatment-antecedent");

  divBody.appendChild(icono);

  // 🧷 Ensamblar todo
  divAntecedente.appendChild(divHeader);
  divAntecedente.appendChild(divBody);

  return divAntecedente;
};

export const crearElementoTratamiento = ({ id, titulo, fecha_creado }) => {
  const divTratamiento = document.createElement("div");
  divTratamiento.classList.add("tratamiento");
  divTratamiento.setAttribute("data-idTratamiento", id);

  const spanFechaTratamiento = document.createElement("span");
  spanFechaTratamiento.textContent = convertirADiaMesAño(fecha_creado);

  divTratamiento.appendChild(spanFechaTratamiento);
  divTratamiento.appendChild(document.createTextNode(titulo));

  return divTratamiento;
};

export const convertirADiaMesAño = (fechaCompleta) => {
  const fecha = new Date(fechaCompleta);
  const fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}/${(
    fecha.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${fecha.getFullYear()}`;
  return fechaFormateada;
};

export function mostrarMensajeSiNoHayTratamientos(idAntecedente) {
  const divBody = document.querySelector(
    `[data-idAntecendente='${idAntecedente}'] .antecedente-body`
  );
  if (!divBody) return;

  // Buscar si quedan tratamientos
  const tratamientosRestantes = divBody.querySelectorAll(".tratamiento");

  // Si ya hay mensaje, no volver a ponerlo
  const mensajeExistente = divBody.querySelector(".mensaje-sin-tratamientos");

  if (tratamientosRestantes.length === 0 && !mensajeExistente) {
    const mensajeSinTratamientos = document.createElement("p");
    mensajeSinTratamientos.classList.add("mensaje-sin-tratamientos");
    mensajeSinTratamientos.textContent = "No hay tratamientos registrados";

    // Insertar antes del botón "+"
    const plusIcon = divBody.querySelector(".plus-icon");
    divBody.insertBefore(mensajeSinTratamientos, plusIcon);
  }
}
