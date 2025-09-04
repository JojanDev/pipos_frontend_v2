import {
  error,
  success,
  get,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  datos,
  validarCampos,
  put,
  DOMSelector,
  configurarBotonCerrar,
  calcularSemanasTotales,
  actualizarTablas,
  prepararDatosMascota,
  inicializarFormularioMascota,
  successTemporal,
  mapearDatosEnContenedor,
} from "../../../helpers";

const manejarSubmit = (
  form,
  id,
  pet,
  esModal,
  tbody_perfilCliente,
  tbody_Mascotas
) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const profilePet = DOMSelector("#pet-profile");

    if (!validarCampos(e)) return;

    const edad_semanas = calcularSemanasTotales(datos);
    const { nombre, sexo, raza_id, usuario_id } = datos;

    const petResponse = await put("mascotas/" + id, {
      id,
      nombre,
      sexo,
      raza_id,
      edad_semanas,
      usuario_id,
    });

    console.log(petResponse);

    if (!petResponse.success) return await error(petResponse.message);

    if (profilePet) {
      const clientResponse = await get(
        `usuarios/${petResponse.data.usuario_id}`
      );
      const typeDocumentResponse = await get(
        `tipos-documentos/${clientResponse.data.tipo_documento_id}`
      );

      petResponse.data.mascota = petResponse.data.nombre;
      petResponse.data.especie = petResponse.data.raza.especie.nombre;
      petResponse.data.raza = petResponse.data.raza.nombre;
      petResponse.data.edad = petResponse.data.edad_semanas;

      console.log(petResponse);
      clientResponse.data["tipo_documento"] = typeDocumentResponse.data.nombre;
      clientResponse.data["dueño"] = clientResponse.data.nombre;

      const dataProfile = { ...clientResponse.data, ...petResponse.data };

      mapearDatosEnContenedor(dataProfile, profilePet);
    }

    successTemporal(petResponse.message);

    // actualizarTablas(pet, tbody_perfilCliente, tbody_Mascotas);
    esModal ? cerrarModal("edit-pet") : cerrarModalYVolverAVistaBase();
  });
};

// --- Controlador Principal ---
export const editPetController = async (parametros = null) => {
  console.log(parametros);

  const { perfil: mascota } = parametros;

  // Elementos del DOM
  const form = DOMSelector("#form-edit-pet");
  const selectEspecie = DOMSelector("#select-especies");
  const selectRazas = DOMSelector("#select-razas");
  const tbody_perfilCliente = DOMSelector("#pets-client .table__body");
  const tbody_Mascotas = DOMSelector("#pets .table__body");
  const containerSelectClient = DOMSelector("#container-select-clients");
  const esModal = !location.hash.includes("mascotas/crear");

  // Obtener mascota
  const { data } = await get(`mascotas/${mascota.id}`);
  const pet = prepararDatosMascota(data);

  // Inicializar formulario
  await inicializarFormularioMascota(
    form,
    selectEspecie,
    selectRazas,
    containerSelectClient,
    pet
  );

  // Eventos
  manejarSubmit(
    form,
    mascota.id,
    pet,
    esModal,
    tbody_perfilCliente,
    tbody_Mascotas
  );

  DOMSelector("[data-modal='edit-pet'").addEventListener("click", (e) => {
    if (e.target.id == "back-edit-pet-client") {
      cerrarModal("edit-pet");
      history.back();
      // location.hash = `#/mascotas/perfil/id=${mascota.id}`;
    }
  });

  // configurarBotonCerrar("back-edit-pet-client", esModal);
};
