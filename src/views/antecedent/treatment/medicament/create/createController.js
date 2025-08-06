import {
  capitalizarPrimeraLetra,
  configurarEventosValidaciones,
  crearElementoTratamiento,
  datos,
  error,
  llenarSelect,
  success,
  validarCampos,
} from "../../../../../helpers";

export const createMedicamentController = async (parametros = null) => {
  const { idTratamiento } = parametros;
  console.log(idTratamiento, "CREATRE MEDICAMENT CONTROLLER");

  llenarSelect({
    endpoint: "medicamentos/info/",
    selector: "#select-medicamentos-info",
    optionMapper: ({ id, nombre, presentacion, via_administracion }) => ({
      id: id,
      text: `${nombre} (${capitalizarPrimeraLetra(
        presentacion
      )} - ${capitalizarPrimeraLetra(via_administracion)})`,
    }),
  });

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
      inputMeses.value == "" &&
      inputSemanas.value == "" &&
      inputDias.value == ""
    ) {
      error("Ingrese al menos un valor en la seccion de Duracion");
      return;
    }

    datos["id_tratamiento"] = idTratamiento;
    console.log(datos);

    // const responseMedicamentoTratamiento = await post("medicamento", {
    //   id_tratamiento: idTratamiento,
    // });

    // if (!responseTratamiento.success) {
    //   await error(responseTratamiento.message);
    //   return;
    // }

    // const divTratamiento = crearElementoTratamiento(responseTratamiento.data);

    // // Busca el antecedente donde insertar el tratamiento
    // const antecedenteContainer = document.querySelector(
    //   `[data-idAntecendente="${idAntecedente}"]`
    // );

    // const body = antecedenteContainer?.querySelector(".antecedente-body");

    // // Quita el mensaje de "No hay tratamientos", si existe
    // const mensaje = body?.querySelector(".mensaje-sin-tratamientos");
    // if (mensaje) mensaje.remove();

    // // Inserta el tratamiento justo después del separador
    // const separador = body?.querySelector(".perfil__separador--treatment");
    // if (separador) {
    //   separador.insertAdjacentElement("afterend", divTratamiento);
    // }

    // await success(responseTratamiento.message);

    // esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  });

  // const btnAtras = document.querySelector(
  //   "#back-register-pet-antecedent-treatment"
  // );

  // btnAtras.addEventListener("click", () => {
  //   esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  // });
};
