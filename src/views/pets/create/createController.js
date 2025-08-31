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
    const { nombre, sexo, id_raza, id_cliente } = datos;

    const response = await post("mascotas", {
      nombre,
      sexo,
      id_raza,
      edad_semanas,
      id_cliente: requiredSelectClient ? id_cliente : idDueno,
    });

    if (!response.success) return await error(response.message);
    await success(response.message);

    actualizarTablas(response.data, tbody_perfilCliente, tbody_Mascotas);

    esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-register-pet-client", esModal);
};
