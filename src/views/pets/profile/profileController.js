// ===============================
// 🎯 FUNCIÓN: Alternar apertura/cierre del cuerpo del antecedente (tipo acordeón)

import { crearBloqueAntecedenteCompleto } from "../../../helpers/antecedentes";
import { get } from "../../../helpers/api";
import { capitalizarPrimeraLetra } from "../../../helpers/diseño";

// ===============================
function toggleBody(headerElement) {
  // Accede al siguiente elemento (el contenido del antecedente)
  const body = headerElement.nextElementSibling;

  // Alterna la clase 'open' para expandir o contraer el cuerpo
  body.classList.toggle("open");
}

// ===============================
// 🎯 FUNCIÓN: Abrir el modal de medicamentos para un tratamiento específico
// ===============================
function abrirModal(nombreTratamiento) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  // Inserta contenido dinámico sobre el tratamiento (esto podrías conectarlo a backend luego)
  modalBody.innerHTML = `
  <p><strong>Tratamiento:</strong> ${nombreTratamiento}</p>
  <ul>
    <li>Otoclean - 500mg</li>
    <li>Aplicar 1 vez al día durante 7 días</li>
  </ul>
`;

  // Muestra el modal (asegúrate que esté con display: flex en CSS cuando activo)
  modal.style.display = "flex";
}

// ===============================
// 🎯 FUNCIÓN: Cerrar el modal de medicamentos
// ===============================
function cerrarModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

const asignarDatosCliente = (data) => {
  const spanNombre = document.querySelector("#profile-nombre");
  const spanTipoDocumento = document.querySelector("#profile-tipoDocumento");
  const spanNumeroDocumento = document.querySelector(
    "#profile-numeroDocumento"
  );
  const spanDireccion = document.querySelector("#profile-direccion");
  const spanTelefono = document.querySelector("#profile-telefono");
  const spanCorreo = document.querySelector("#profile-correo");

  const {
    correo,
    direccion,
    nombre,
    numeroDocumento,
    telefono,
    tipoDocumento,
  } = data.cliente.info;

  spanNombre.textContent = nombre;
  spanTipoDocumento.textContent = tipoDocumento.nombre;
  spanNumeroDocumento.textContent = numeroDocumento;
  spanDireccion.textContent = direccion;
  spanTelefono.textContent = telefono;
  spanCorreo.textContent = correo;
};

const asignarDatosMascota = (data) => {
  const spanNombre = document.querySelector("#profile-nombrePet");
  const spanEspecie = document.querySelector("#profile-especie");
  const spanRaza = document.querySelector("#profile-raza");
  const spanSexo = document.querySelector("#profile-sexo");
  const spanEdad = document.querySelector("#profile-edad");
  // const spanCorreo = document.querySelector("#profile-correo");

  const { nombre, raza, edadFormateada, sexo } = data;

  spanNombre.textContent = nombre;
  spanEspecie.textContent = raza.especie.nombre;
  spanRaza.textContent = raza.nombre;
  spanSexo.textContent = capitalizarPrimeraLetra(sexo);
  spanEdad.textContent = edadFormateada;
};

export const profilePetController = async (parametros = null) => {
  // ID de la mascota
  const { id } = parametros;

  //Peticion para obtener la informacion de la mascota
  const responseMascota = await get(`mascotas/${id}`);
  const responseAntecedentesMascota = await get(`antecedentes/mascota/${id}`);
  console.log(responseMascota);
  console.log(responseAntecedentesMascota);

  asignarDatosCliente(responseMascota.data);
  asignarDatosMascota(responseMascota.data);

  if (responseAntecedentesMascota.success) {
    const contenedorAntecedente = document.querySelector(
      "#profile-pet-antecedent"
    );

    if (contenedorAntecedente) {
      responseAntecedentesMascota.data.forEach((antecedente) => {
        const bloqueAntecedenteCreado =
          crearBloqueAntecedenteCompleto(antecedente);
        contenedorAntecedente.append(bloqueAntecedenteCreado);
      });
    }
  }

  const contenedorPerfil = document.querySelector(".contenedor-perfil--pet");

  contenedorPerfil.addEventListener("click", (e) => {
    console.log(e.target.classList);
    if (e.target.closest(".antecedente-header")) {
      toggleBody(e.target.closest(".antecedente-header"));
    }

    if (e.target.id == "register-antecedent") {
      location.hash = `#/antecedente/crear/id=${id}`;
    }

    if (e.target.classList.contains("tratamiento")) {
      const idTratamiento = e.target.getAttribute("data-idtratamiento");
      const titleAntecedent = document.querySelector("#title-antecedent");
      location.hash = `#/antecedente/tratamiento/id=${idTratamiento}&tituloAntecedente=${titleAntecedent.textContent}`;
    }
  });
};
