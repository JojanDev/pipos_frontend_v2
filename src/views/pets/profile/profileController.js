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
  successTemporal,
} from "../../../helpers";
import { routes } from "../../../router/routes";
import { mapearDatosEnContenedor } from "../../../helpers/domMapper";
import hasPermission from "../../../helpers/hasPermission";

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
    // "#register-treatment-antecedent",
  ];

  botones.forEach((selector) => {
    const boton = DOMSelector(selector);
    if (boton) boton.remove();
  });

  // Botones de eliminar antecedentes
  const botonesEliminarAntecedente = DOMSelectorAll(".delete-antecedent");
  console.log(botonesEliminarAntecedente);

  botonesEliminarAntecedente.forEach((btn) => btn.remove());

  const botonesEditarAntecedente = DOMSelectorAll(".edit-antecedent");
  console.log(botonesEliminarAntecedente);
  botonesEditarAntecedente.forEach((btn) => btn.remove());

  const botonesCrearTratamiento = DOMSelectorAll(
    "#register-treatment-antecedent"
  );
  botonesCrearTratamiento.forEach((btn) => btn.remove());
};

// ===============================
function toggleBody(headerElement) {
  // Accede al siguiente elemento (el contenido del antecedente)
  const body = headerElement.nextElementSibling;

  // Alterna la clase 'open' para expandir o contraer el cuerpo
  body.classList.toggle("open");
}

export const profilePetController = async (parametros = null) => {
  const contenedorVista = DOMSelector("#pet-profile");

  let estado_vital = true;

  console.log(parametros);

  const { perfil: mascota } = parametros;

  const mascota_id = mascota.id;

  //Peticion para obtener la informacion de la mascota
  const petResponse = await get(`mascotas/${mascota_id}`);
  console.log(petResponse);

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
  petResponse.data.edad = petResponse.data.edad_semanas
    ? convertirEdadCorta(petResponse.data.edad_semanas)
    : "Desconocida";

  console.log(petResponse);
  clientResponse.data["tipo_documento"] = typeDocumentResponse.data.nombre;
  clientResponse.data["dueño"] = clientResponse.data.nombre;

  const dataProfile = { ...clientResponse.data, ...petResponse.data };

  mapearDatosEnContenedor(dataProfile, contenedorVista);

  const contenedorAntecedente = DOMSelector("#profile-pet-antecedent");
  if (responseAntecedentesMascota.success) {
    const placeholderAnterior = DOMSelector(".placeholder-antecedentes");
    if (placeholderAnterior) placeholderAnterior.remove();
    if (contenedorAntecedente) {
      await Promise.all(
        responseAntecedentesMascota.data.map(async (antecedente) => {
          const bloqueAntecedenteCreado = await crearBloqueAntecedenteCompleto(
            antecedente
          );
          contenedorAntecedente.append(bloqueAntecedenteCreado);
        })
      );
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

  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.closest(".delete-antecedent")) {
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");
      const responseDelete = await del(`antecedentes/${idAntecedente}`);
      if (!responseDelete.success) return await error(responseDelete.message);

      contenedorId.remove();
      successTemporal(responseDelete.message);
      if (contenedorAntecedente.children.length <= 0) {
        const placeholder = document.createElement("p");
        placeholder.classList.add("placeholder-antecedentes");
        placeholder.textContent = "No hay antecedentes registrados";
        contenedorAntecedente.append(placeholder);
      }
      return;
    }

    if (e.target.closest(".edit-antecedent")) {
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");
      location.hash = `#/mascotas/perfil/id=${mascota_id}/antecedente/id=${idAntecedente}/editar`;
    }

    if (e.target.closest(".antecedente-header")) {
      toggleBody(e.target.closest(".antecedente-header"));
    }

    if (e.target.id == "register-antecedent") {
      // await cargarComponente(routes.antecedente.crear, { id, id });
      location.hash = `#/mascotas/perfil/id=${mascota.id}/antecedente/crear`;
    }

    if (e.target.id == "edit-pet") {
      // await cargarComponente(routes.mascotas.editar, { id, id });

      location.hash = `#/mascotas/perfil/id=${mascota.id}/editar`;
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

      // await cargarComponente(routes.antecedente.tratamiento, {
      //   id: idTratamiento,
      //   tituloAntecedente: tituloAntecedente,
      //   estado_vital,
      // });
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");
      location.hash = `#/mascotas/perfil/id=${mascota.id}/antecedente/id=${idAntecedente}/tratamiento/perfil/id=${idTratamiento}`;
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

      const { data: mascota } = await get(`mascotas/${mascota_id}`);
      mascota.estado_vital = false;
      delete mascota.raza;
      console.log(mascota);

      const eliminado = await put(`mascotas/${mascota_id}`, mascota);

      if (!eliminado.success) return await error(eliminado.message);

      desactivarBotonesPerfilMascota();
      estado_vital = false;
      successTemporal("Mascota desactivada correctamente");
      return;
    }

    if (e.target.id == "register-treatment-antecedent") {
      const contenedorId = e.target.closest("[data-idAntecendente]");
      const idAntecedente = contenedorId.getAttribute("data-idAntecendente");

      // location.hash = `#/antecedente/tratamientoCrear/idAntecedente=${idAntecedente}`;
      location.hash = `#/mascotas/perfil/id=${mascota_id}/antecedente/id=${idAntecedente}/tratamiento/crear`;
    }
  });
};
