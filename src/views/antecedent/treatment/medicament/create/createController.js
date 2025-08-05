import {
  configurarEventosValidaciones,
  crearElementoTratamiento,
  error,
  success,
  validarCampos,
} from "../../../../../helpers";

export const createMedicamentController = async (parametros = null) => {
  const { idTratamiento } = parametros;
  console.log(idTratamiento, "CREATRE MEDICAMENT CONTROLLER");

  const form = document.querySelector(
    "#form-register-pet-antecedent-treatment-medicament"
  );

  const esModal = !location.hash.includes("antecedente/tratamientoCrear");

  console.log(form);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputMeses = document.querySelector('[name="meses"]');
    const inputSemanas = document.querySelector('[name="semanas"]');
    const inputDias = document.querySelector('[name="dias"]');
    if (!validarCampos(e)) return;

    if (
      inputMeses.textContent == "" ||
      inputSemanas.textContent == "" ||
      inputDias.textContent == ""
    ) {
      error("Ingrese al menos un valor en la seccion de Duracion");
    }

    datos["id_antecedente"] = idAntecedente;
    console.log(datos);

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

    // esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  });

  // const btnAtras = document.querySelector(
  //   "#back-register-pet-antecedent-treatment"
  // );

  // btnAtras.addEventListener("click", () => {
  //   esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  // });
};
