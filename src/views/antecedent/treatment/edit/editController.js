import {
  success,
  crearElementoTratamiento,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelect,
  error,
  get,
  put,
  cerrarModal,
  llenarSelectVeterinarios,
  DOMSelector,
  mapearDatosEnContenedor,
  successTemporal,
} from "../../../../helpers";

export const editTreatmentController = async (parametros = null) => {
  const { tratamiento_id } = parametros;
  const contenedorTratamiento = DOMSelector('[data-modal="pet-treatment"]');
  console.log(contenedorTratamiento);

  const tratamientoResponse = await get("tratamientos/" + tratamiento_id);
  console.log(tratamientoResponse);

  const form = DOMSelector("#form-register-pet-antecedent-treatment");
  const esModal = !location.hash.includes("antecedente/tratamientoEditar");

  await llenarSelectVeterinarios();

  mapearDatosEnContenedor(
    {
      ...tratamientoResponse.data,
      "select-veterinarios": tratamientoResponse.data.usuario_id,
    },
    form
  );

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;

    const tratamientoUpdatedResponse = await put(
      `tratamientos/${tratamiento_id}`,
      { ...datos, antecedente_id: tratamientoResponse.data.antecedente_id }
    );

    console.log(tratamientoUpdatedResponse);

    if (!tratamientoUpdatedResponse.success)
      return await error(tratamientoUpdatedResponse.message);

    const divTratamiento = crearElementoTratamiento(
      tratamientoUpdatedResponse.data
    );

    // DOMSelector("#treatment-title").textContent =
    //   tratamientoUpdatedResponse.data.titulo;
    // DOMSelector("#treatment-description").textContent =
    //   tratamientoUpdatedResponse.data.descripcion;

    const veterinarioResponse = await get(
      `usuarios/${tratamientoUpdatedResponse.data.usuario_id}`
    );

    // DOMSelector("#treatment-veterinario").textContent =
    //   "Veterinario asociado: " + veterinarioResponse.data.nombre;

    mapearDatosEnContenedor(
      {
        ...tratamientoUpdatedResponse.data,
        veterinario: veterinarioResponse.data.nombre,
      },
      contenedorTratamiento
    );

    successTemporal(tratamientoUpdatedResponse.message);

    esModal
      ? cerrarModal("edit-pet-antecedent-treatment")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = DOMSelector("#back-edit-pet-antecedent-treatment");

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("edit-pet-antecedent-treatment")
      : cerrarModalYVolverAVistaBase();
  });
};
