import {
  error,
  success,
  get,
  post,
  llenarSelect,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelectClientes,
  configurarBotonCerrar,
  DOMSelector,
  inicializarFormularioMascota,
  calcularSemanasTotales,
  actualizarTablas,
  successTemporal,
} from "../../../helpers";

export const createPetController = async (idDueno) => {
  const form = DOMSelector("#form-register-pet");
  const selectEspecie = DOMSelector("#select-especies");
  const selectRazas = DOMSelector("#select-razas");
  const tbody_perfilCliente = DOMSelector("#pets-client .table__body");
  const tbody_Mascotas = DOMSelector("#pets .table__body");
  const containerSelectClient = DOMSelector("#container-select-clients");
  const esModal = !location.hash.includes("mascotas/crear");

  // Inicializar formulario (sin petData, porque es creación)
  await inicializarFormularioMascota(
    form,
    selectEspecie,
    selectRazas,
    containerSelectClient
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const requiredSelectClient =
      !containerSelectClient.classList.contains("hidden");

    if (!validarCampos(e)) return;

    const edad_semanas = calcularSemanasTotales(datos);
    const { nombre, sexo, raza_id, usuario_id } = datos;

    const petResponse = await post("mascotas", {
      nombre,
      sexo,
      raza_id,
      edad_semanas,
      usuario_id: requiredSelectClient ? usuario_id : idDueno,
    });

    if (!petResponse.success) return await error(petResponse.message);
    successTemporal(petResponse.message);

    actualizarTablas(petResponse.data, tbody_perfilCliente, tbody_Mascotas);

    esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  });

  DOMSelector("[data-modal='create-pet'").addEventListener("click", (e) => {
    if (e.target.id == "back-register-pet-client") {
      cerrarModal("create-pet");
      location.hash = "#/mascotas";
    }
  });

  configurarBotonCerrar("back-register-pet-client", esModal);
};
