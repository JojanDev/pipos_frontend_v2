import Swal from "sweetalert2";
import {
  crearBloqueAntecedenteCompleto,
  get,
  capitalizarPrimeraLetra,
  del,
  error,
  success,
  cargarComponente,
  put,
  DOMSelector,
  DOMSelectorAll,
  convertirEdadCorta,
} from "../../../helpers";
import { routes } from "../../../router/routes";
import { mapearDatosEnContenedor } from "../../../helpers/domMapper";

/**
 * Desactiva los botones principales del perfil de la mascota
 * cuando la mascota está desactivada.
 */
const desactivarBotonesPerfilMascota = () => {
  // Botones principales del perfil
  const botones = [
    "#edit-pet", // Editar mascota
    "#desactivar-pet", // Desactivar mascota
    "#register-antecedent", // Crear antecedente
    "#register-treatment-antecedent",
  ];

  botones.forEach((selector) => {
    const boton = DOMSelector(selector);
    if (boton) boton.remove();
  });

  // Botones de eliminar antecedentes
  const botonesEliminarAntecedente = DOMSelectorAll(".delete-antecedent");
  botonesEliminarAntecedente.forEach((btn) => btn.remove());

  const botonesEditarAntecedente = DOMSelectorAll(".edit-antecedent");
  botonesEditarAntecedente.forEach((btn) => btn.remove());
};

// ===============================
function toggleBody(headerElement) {
  // Accede al siguiente elemento (el contenido del antecedente)
  const body = headerElement.nextElementSibling;

  // Alterna la clase 'open' para expandir o contraer el cuerpo
  body.classList.toggle("open");
}

export const profilePetController = async (parametros = null) => {
  let estado_vital = true;
  const profilePet = DOMSelector("#pet-profile");

  console.log(parametros);

  // const dataJSON = localStorage.getItem("data");
  // const data = JSON.parse(dataJSON);

  // if (data.id_rol != 1) {
  //   const opcionesAdmin = DOMSelectorAll(".admin");
  //   [...opcionesAdmin].forEach((element) => {
  //     element.remove();
  //   });
  // }
  // ID de la mascota
  const { perfil: mascota } = parametros;

  const mascota_id = mascota.id;

  //Peticion para obtener la informacion de la mascota
  const petResponse = await get(`mascotas/${mascota_id}`);
  const clientResponse = await get(`usuarios/${petResponse.data.usuario_id}`);
  const typeDocumentResponse = await get(
    `tipos-documentos/${clientResponse.data.tipo_documento_id}`
  );

  const responseAntecedentesMascota = await get(
    `antecedentes/mascota/${mascota_id}`
  );

  petResponse.data.mascota = petResponse.data.nombre;
  petResponse.data.especie = petResponse.data.raza.especie.nombre;
  petResponse.data.raza = petResponse.data.raza.nombre;
  petResponse.data.edad = convertirEdadCorta(petResponse.data.edad_semanas);

  console.log(petResponse);
  clientResponse.data["tipo_documento"] = typeDocumentResponse.data.nombre;
  clientResponse.data["dueño"] = clientResponse.data.nombre;

  const dataProfile = { ...clientResponse.data, ...petResponse.data };

  mapearDatosEnContenedor(dataProfile, profilePet);

  const contenedorAntecedente = DOMSelector("#profile-pet-antecedent");
  if (responseAntecedentesMascota.success) {
    const placeholderAnterior = DOMSelector(".placeholder-antecedentes");
    if (placeholderAnterior) placeholderAnterior.remove();
    if (contenedorAntecedente) {
      responseAntecedentesMascota.data.forEach(async (antecedente) => {
        const bloqueAntecedenteCreado = await crearBloqueAntecedenteCompleto(
          antecedente
        );
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

  if (!petResponse.data.estado_vital) {
    desactivarBotonesPerfilMascota();
    estado_vital = false;
  }

  const contenedorPerfil = DOMSelector("#pet-profile");

  contenedorPerfil.addEventListener("click", async (e) => {
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

    if (e.target.closest(".edit-antecedent")) {
      // toggleBody(e.target.closest(".antecedente-header"));
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");

      await cargarComponente(routes.antecedente.editar, {
        antecedente_id: idAntecedente,
        mascota_id,
      });
      // const responseDelete = await del("antecedentes/" + idAntecedente);
      // if (!responseDelete.success) {
      //   await error(responseDelete.message);
      //   return;
      // }
      // contenedorId.remove();
      // await success(responseDelete.message);
      // return;
    }

    if (e.target.closest(".antecedente-header")) {
      toggleBody(e.target.closest(".antecedente-header"));
    }

    if (e.target.id == "register-antecedent") {
      await cargarComponente(routes.antecedente.crear, { id, id });
    }

    if (e.target.id == "edit-pet") {
      await cargarComponente(routes.mascotas.editar, { id, id });
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
      console.log(estado_vital);

      await cargarComponente(routes.antecedente.tratamiento, {
        id: idTratamiento,
        tituloAntecedente: tituloAntecedente,
        estado_vital,
      });
    }

    if (e.target.id == "desactivar-pet") {
      const result = await Swal.fire({
        title: "Confirmacion de accion",
        text:
          "Al desactivar esta mascota, se marcara como fallecida.\n\n" +
          "No podras editar sus datos ni agregar informacion nueva.\n\n" +
          "Solo podras visualizarla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6", // azul para confirmar
        cancelButtonColor: "#d33", // rojo para cancelar
      });

      if (!result.isConfirmed) {
        return;
      }

      const eliminado = await put("mascotas/desactivar/" + mascota_id);

      if (!eliminado.success) {
        await error(eliminado.message);
        return;
      }

      desactivarBotonesPerfilMascota();
      estado_vital = false;
      await success(eliminado.message);
      return;
    }

    if (e.target.id == "register-treatment-antecedent") {
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");

      location.hash = `#/antecedente/tratamientoCrear/idAntecedente=${idAntecedente}`;
    }
  });
};
