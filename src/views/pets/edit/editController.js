import {
  error,
  success,
  get,
  cerrarModal,
  datos,
  validarCampos,
  put,
  DOMSelector,
  calcularSemanasTotales,
  actualizarTablas,
  prepararDatosMascota,
  inicializarFormularioMascota,
  successTemporal,
  mapearDatosEnContenedor,
  renderNotFound,
  convertirADiaMesAño,
} from "../../../helpers";
import hasPermission from "../../../helpers/hasPermission";

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

    const { nombre, sexo, raza_id, usuario_id, fecha_nacimiento } = datos;

    const petResponse = await put("mascotas/" + id, {
      id,
      nombre,
      sexo,
      raza_id,
      fecha_nacimiento,
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

      const { data: raza } = await get(`razas/${petResponse.data.raza_id}`);
      const { data: especie } = await get(`especies/${raza.especie_id}`);

      console.log(petResponse.data);

      petResponse.data.mascota = petResponse.data.nombre;
      petResponse.data.especie = especie.nombre;
      petResponse.data.raza = raza.nombre;
      petResponse.data.fecha_nacimiento = convertirADiaMesAño(
        petResponse.data.fecha_nacimiento
      );

      console.log(petResponse);
      clientResponse.data["tipo_documento"] = typeDocumentResponse.data.nombre;
      clientResponse.data[
        "dueño"
      ] = `${clientResponse.data.nombre} ${clientResponse.data.apellido}`;

      const dataProfile = { ...clientResponse.data, ...petResponse.data };

      mapearDatosEnContenedor(dataProfile, profilePet);
    }

    successTemporal(petResponse.message);

    // actualizarTablas(pet, tbody_perfilCliente, tbody_Mascotas);
    cerrarModal("edit-pet");
    history.back();
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
  if (!data.estado_vital) return await renderNotFound();
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
    }
  });
};
