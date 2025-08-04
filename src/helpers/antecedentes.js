export const crearBloqueAntecedenteCompleto = ({
  titulo,
  diagnostico,
  fecha_creado,
  tratamientos = [],
  message = "No hay tratamientos registrados",
}) => {
  const fechaFormateada = convertirADiaMesAño(fecha_creado);

  // 📦 Contenedor principal
  const divAntecedente = document.createElement("div");
  divAntecedente.classList.add("antecedente");

  // 🧷 Encabezado
  const divHeader = document.createElement("div");
  divHeader.classList.add("antecedente-header");

  const spanFecha = document.createElement("span");
  spanFecha.textContent = fechaFormateada;

  const spanTitulo = document.createElement("span");
  spanTitulo.textContent = titulo;
  spanTitulo.setAttribute("id", "title-antecedent");

  divHeader.appendChild(spanFecha);
  divHeader.appendChild(spanTitulo);

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
      const divTratamiento = document.createElement("div");
      divTratamiento.classList.add("tratamiento");
      divTratamiento.setAttribute("data-idTratamiento", tratamiento.id);

      const spanFechaTratamiento = document.createElement("span");
      spanFechaTratamiento.textContent = convertirADiaMesAño(
        tratamiento.fecha_creado
      );

      divTratamiento.appendChild(spanFechaTratamiento);
      divTratamiento.appendChild(document.createTextNode(tratamiento.titulo));

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
  divBody.appendChild(icono);

  // 🧷 Ensamblar todo
  divAntecedente.appendChild(divHeader);
  divAntecedente.appendChild(divBody);

  return divAntecedente;
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
