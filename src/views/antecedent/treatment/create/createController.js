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
  llenarSelectVeterinarios,
  errorTemporal,
  successTemporal,
  cerrarModal,
  get,
  renderNotFound,
} from "../../../../helpers";

export const createTreatmentController = async (parametros = null) => {
  console.log(parametros);
  const { antecedente, perfil: mascota } = parametros;

  // const { idAntecedente } = parametros;
  const getMascota = await get(`mascotas/${mascota.id}`);

  if (!getMascota.data.estado_vital) return await renderNotFound();

  const form = document.querySelector(
    "#form-register-pet-antecedent-treatment"
  );
  const esModal = !location.hash.includes("antecedente/tratamientoCrear");

  await llenarSelectVeterinarios();

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    datos["antecedente_id"] = antecedente.id;

    const responseTratamiento = await post("tratamientos", datos);

    if (!responseTratamiento.success)
      return errorTemporal(responseTratamiento.message);

    const divTratamiento = crearElementoTratamiento(responseTratamiento.data);

    // Busca el antecedente donde insertar el tratamiento
    const antecedenteContainer = document.querySelector(
      `[data-idAntecendente="${antecedente.id}"]`
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

    successTemporal(responseTratamiento.message);

    esModal
      ? cerrarModal("create-pet-antecedent-treatment")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector(
    "#back-register-pet-antecedent-treatment"
  );

  btnAtras.addEventListener("click", () => {
    // esModal
    cerrarModal("create-pet-antecedent-treatment");
    history.back();
    //   : cerrarModalYVolverAVistaBase();
  });
};
