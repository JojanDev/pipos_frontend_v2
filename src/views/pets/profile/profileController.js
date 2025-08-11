import {
  crearBloqueAntecedenteCompleto,
  get,
  capitalizarPrimeraLetra,
  del,
  error,
  success,
  cargarComponente,
} from "../../../helpers";
import { routes } from "../../../router/routes";

// ===============================
function toggleBody(headerElement) {
  // Accede al siguiente elemento (el contenido del antecedente)
  const body = headerElement.nextElementSibling;

  // Alterna la clase 'open' para expandir o contraer el cuerpo
  body.classList.toggle("open");
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
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);
  console.log(data);

  if (data.id_rol == 2) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }
  // ID de la mascota
  const { id } = parametros;

  //Peticion para obtener la informacion de la mascota
  const responseMascota = await get(`mascotas/${id}`);
  const responseAntecedentesMascota = await get(`antecedentes/mascota/${id}`);
  console.log(responseMascota);
  console.log("responseAntecedentesMascota", responseAntecedentesMascota);

  asignarDatosCliente(responseMascota.data);
  asignarDatosMascota(responseMascota.data);

  const contenedorAntecedente = document.querySelector(
    "#profile-pet-antecedent"
  );
  if (responseAntecedentesMascota.success) {
    const placeholderAnterior = document.querySelector(
      ".placeholder-antecedentes"
    );
    if (placeholderAnterior) placeholderAnterior.remove();
    if (contenedorAntecedente) {
      responseAntecedentesMascota.data.forEach((antecedente) => {
        const bloqueAntecedenteCreado =
          crearBloqueAntecedenteCompleto(antecedente);
        contenedorAntecedente.append(bloqueAntecedenteCreado);
      });
    }
  } else {
    const placeholder = document.createElement("p");
    placeholder.classList.add("placeholder-antecedentes");
    placeholder.textContent = "No hay antecedentes registrados";
    contenedorAntecedente.append(placeholder);
    // return;
  }

  const contenedorPerfil = document.querySelector(".contenedor-perfil--pet");

  contenedorPerfil.addEventListener("click", async (e) => {
    console.log(e.target.classList);

    if (e.target.closest(".delete-antecedent")) {
      // toggleBody(e.target.closest(".antecedente-header"));
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");
      const responseDelete = await del("antecedentes/" + idAntecedente);
      if (!responseDelete.success) {
        await error(responseDelete.message);
        return;
      }
      contenedorId.remove();
      await success(responseDelete.message);
      return;
    }

    if (e.target.closest(".antecedente-header")) {
      toggleBody(e.target.closest(".antecedente-header"));
    }

    if (e.target.id == "register-antecedent") {
      await cargarComponente(routes.antecedente.crear, { id, id });
      // location.hash = `#/antecedente/crear/id=${id}`;
    }

    if (e.target.classList.contains("tratamiento")) {
      const idTratamiento = e.target.getAttribute("data-idtratamiento");
      // Encuentra el contenedor .antecedente más cercano al tratamiento clickeado
      const contenedorAntecedente = e.target.closest(".antecedente");

      // Dentro de ese contenedor busca el título
      const tituloElemento = contenedorAntecedente.querySelector(
        ".antecedente-titulo"
      );
      const tituloAntecedente = tituloElemento?.textContent || "Sin título";

      location.hash = `#/antecedente/tratamiento/id=${idTratamiento}&tituloAntecedente=${encodeURIComponent(
        tituloAntecedente
      )}`;
    }

    if (e.target.id == "register-treatment-antecedent") {
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");

      location.hash = `#/antecedente/tratamientoCrear/idAntecedente=${idAntecedente}`;
    }

    // if (e.target.id == "edit-pet") {
    //   location.hash = `#/mascotas/editar/id=${id}`;
    // }
  });
};
