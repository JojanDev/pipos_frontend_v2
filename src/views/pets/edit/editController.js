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
} from "../../../helpers";
import {
  asignarDatosCliente,
  asignarDatosMascota,
} from "../profile/profileController";

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

    if (!petResponse.success) return await error(petResponse.message);

    if (DOMSelector("#pet-profile")) {
      asignarDatosCliente(pet);
      asignarDatosMascota(pet);
    }

    await success(petResponse.message);

    actualizarTablas(pet, tbody_perfilCliente, tbody_Mascotas);
    esModal ? cerrarModal("edit-pet") : cerrarModalYVolverAVistaBase();
  });
};

// --- Controlador Principal ---
export const editPetController = async (parametros = null) => {
  const { id } = parametros;

  // Elementos del DOM
  const form = DOMSelector("#form-edit-pet");
  const selectEspecie = DOMSelector("#select-especies");
  const selectRazas = DOMSelector("#select-razas");
  const tbody_perfilCliente = DOMSelector("#pets-client .table__body");
  const tbody_Mascotas = DOMSelector("#pets .table__body");
  const containerSelectClient = DOMSelector("#container-select-clients");
  const esModal = !location.hash.includes("mascotas/crear");

  // Obtener mascota
  const { data } = await get("mascotas/" + id);
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
  manejarSubmit(form, id, pet, esModal, tbody_perfilCliente, tbody_Mascotas);
  configurarBotonCerrar("back-edit-pet-client", esModal);
};
