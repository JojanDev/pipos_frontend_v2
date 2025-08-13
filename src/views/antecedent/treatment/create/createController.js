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
} from "../../../../helpers";

export const createTreatmentController = (parametros = null) => {
  const { idAntecedente } = parametros;

  const form = document.querySelector(
    "#form-register-pet-antecedent-treatment"
  );
  const esModal = !location.hash.includes("antecedente/tratamientoCrear");

  llenarSelect({
    endpoint: "personal/veterinarios/",
    selector: "#select-veterinarios",
    optionMapper: (veterinario) => ({
      id: veterinario.id,
      text: veterinario.info.nombre,
    }),
  });

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    datos["id_antecedente"] = idAntecedente;

    const responseTratamiento = await post("tratamientos", datos);

    if (!responseTratamiento.success) {
      await error(responseTratamiento.message);
      return;
    }

    const divTratamiento = crearElementoTratamiento(responseTratamiento.data);

    // Busca el antecedente donde insertar el tratamiento
    const antecedenteContainer = document.querySelector(
      `[data-idAntecendente="${idAntecedente}"]`
    );

    const body = antecedenteContainer?.querySelector(".antecedente-body");

    // Quita el mensaje de "No hay tratamientos", si existe
    const mensaje = body?.querySelector(".mensaje-sin-tratamientos");
    if (mensaje) mensaje.remove();

    // Inserta el tratamiento justo después del separador
    const separador = body?.querySelector(".perfil__separador--treatment");
    if (separador) {
      separador.insertAdjacentElement("afterend", divTratamiento);
    }

    await success(responseTratamiento.message);

    esModal
      ? cerrarModal("create-pet-antecedent-treatment")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector(
    "#back-register-pet-antecedent-treatment"
  );

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("create-pet-antecedent-treatment")
      : cerrarModalYVolverAVistaBase();
  });
};
