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
} from "../../../../helpers";

export const editTreatmentController = async (parametros = null) => {
  const { id } = parametros;

  const responseTratamiento = await get("tratamientos/" + id);
  console.log(responseTratamiento);

  document.querySelector("#titulo-tratamiento-edit").value =
    responseTratamiento.data.titulo;
  document.querySelector("#descripcion-tratamiento-edit").textContent =
    responseTratamiento.data.descripcion;

  const form = document.querySelector(
    "#form-register-pet-antecedent-treatment"
  );
  const esModal = !location.hash.includes("antecedente/tratamientoEditar");

  await llenarSelect({
    endpoint: "personal/veterinarios/",
    selector: "#select-veterinarios",
    optionMapper: (veterinario) => ({
      id: veterinario.id,
      text: veterinario.info.nombre,
    }),
  });

  document.querySelector("#select-veterinarios").value =
    responseTratamiento.data.id_personal;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;

    const responseActualizado = await put("tratamientos/" + id, datos);

    if (!responseActualizado.success) {
      await error(responseTratamiento.message);
      return;
    }

    const divTratamiento = crearElementoTratamiento(responseActualizado.data);

    document.querySelector("#treatment-title").textContent =
      responseActualizado.data.titulo;
    document.querySelector("#treatment-description").textContent =
      responseActualizado.data.descripcion;

    const veterinario = await get(
      "personal/" + responseActualizado.data.id_personal
    );

    document.querySelector("#treatment-veterinario").textContent =
      "Veterinario asociado: " + veterinario.data.info.nombre;

    await success(responseActualizado.message);

    esModal
      ? cerrarModal("edit-pet-antecedent-treatment")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector(
    "#back-edit-pet-antecedent-treatment"
  );

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("edit-pet-antecedent-treatment")
      : cerrarModalYVolverAVistaBase();
  });
};
