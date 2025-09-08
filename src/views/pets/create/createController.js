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

export const createPetController = async (parametros = null) => {
  console.log(parametros);

  const { perfil: usuario } = parametros;
  const contenedorVista = DOMSelector("[data-modal='create-pet']");

  const form = DOMSelector("#form-register-pet");
  const selectEspecie = DOMSelector("#select-especies");
  const selectRazas = DOMSelector("#select-razas");
  const tbody_perfilCliente = DOMSelector("#pets-client .table__body");
  const tbody_Mascotas = DOMSelector("#pets .table__body");
  const esModal = !location.hash.includes("mascotas/crear");

  let containerSelectClient = true;
  if (location.hash.includes("clientes/perfil")) {
    const selectCliente = DOMSelector("#select-clients");
    const contenedor = selectCliente?.closest(".form__container-field");
    contenedor.remove();
    containerSelectClient = false;
  }

  // Inicializar formulario (sin petData, porque es creación)
  await inicializarFormularioMascota(
    form,
    selectEspecie,
    selectRazas,
    containerSelectClient
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // const requiredSelectClient =
    //   !containerSelectClient.classList.contains("hidden");

    if (!validarCampos(e)) return;

    const edad_semanas = calcularSemanasTotales(datos);
    const { nombre, sexo, raza_id, usuario_id } = datos;

    const petResponse = await post("mascotas", {
      nombre,
      sexo,
      raza_id,
      edad_semanas,
      usuario_id: containerSelectClient ? usuario_id : usuario.id,
    });

    if (!petResponse.success) return await error(petResponse.message);
    successTemporal(petResponse.message);

    actualizarTablas(petResponse.data, tbody_perfilCliente, tbody_Mascotas);

    cerrarModal("create-pet");
    history.back();
  });

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-register-pet-client") {
      cerrarModal("create-pet");

      // location.hash = "#/mascotas";
      history.back();
    }
  });

  // configurarBotonCerrar("back-register-pet-client", esModal);
};
