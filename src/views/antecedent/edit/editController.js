import {
  error,
  success,
  crearBloqueAntecedenteCompleto,
  post,
  llenarSelect,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  cerrarModal,
  get,
  put,
  configurarBotonCerrar,
  DOMSelector,
  successTemporal,
} from "../../../helpers";

export const editAntecedentController = async (parametros = null) => {
  console.log(parametros);

  const { perfil: mascota, antecedente } = parametros;
  // const { antecedente_id, mascota_id } = parametros;

  const containerPerfilMascota = DOMSelector(".contenedor-perfil--pet");
  const contenedorVista = DOMSelector('[data-modal="edit-pet-antecedent"]');

  const antecedenteResponse = await get("antecedentes/" + antecedente.id);

  console.log(antecedenteResponse.data.titulo);

  DOMSelector("#titulo-antecedente-edit").value = antecedenteResponse.data.titulo;
  DOMSelector("#diagnostico-antecedente-edit").textContent =
    antecedenteResponse.data.diagnostico;

  const selectPets = DOMSelector("#select-pets");

  if (!containerPerfilMascota) {
    if (selectPets) {
      llenarSelect({
        endpoint: "mascotas",
        selector: "#select-pets",
        optionMapper: (pet) => ({
          id: pet.id,
          text: `${pet.raza.nombre} - ${pet.nombre}`,
        }),
      });
    }
  } else {
    const contenedor = selectPets?.closest(".form__container-field");
    contenedor?.classList.add("hidden");
  }

  const form = DOMSelector("#form-register-pet-antecedent");
  const esModal = !location.hash.includes("antecedente/editar");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const containerSelectPet = document
      .querySelector("#container-select-pets")
      .classList.contains("hidden")
      ? false
      : true;

    if (!validarCampos(e)) return;

    datos["mascota_id"] = mascota.id;
    console.log(datos);

    const responseAntecedente = await put(
      "antecedentes/" + antecedente.id,
      datos
    );

    if (!responseAntecedente.success)
      return await error(responseAntecedente.message);

    DOMSelector(
      `[data-idAntecendente="${antecedente.id}"] .antecedente-titulo`
    ).textContent = responseAntecedente.data.titulo;
    DOMSelector(
      `[data-idAntecendente="${antecedente.id}"] .antecedente-diagnostico`
    ).innerHTML = `<strong>Diagnóstico:</strong> ${responseAntecedente.data.diagnostico}`;

    successTemporal(responseAntecedente.message);

    esModal
      ? cerrarModal("edit-pet-antecedent")
      : cerrarModalYVolverAVistaBase();
  });

  contenedorVista.addEventListener('click', (e) => {
    if (e.target.id == "back-edit-pet-antecedent") {
      cerrarModal("edit-pet-antecedent");
      history.back();
    }
  });
  // configurarBotonCerrar("back-edit-pet-antecedent", esModal);
};
