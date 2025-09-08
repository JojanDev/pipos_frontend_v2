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
  DOMSelector,
  successTemporal,
  configurarBotonCerrar,
  get,
  renderNotFound,
} from "../../../helpers";

export const createAntecedentController = async (parametros = null) => {
  console.log(parametros);

  const { perfil: mascota } = parametros;
  const getMascota = await get(`mascotas/${mascota.id}`);

  if (!getMascota.data.estado_vital) return await renderNotFound();

  const containerPerfilMascota = DOMSelector("#pet-profile");
  const contenedorVista = DOMSelector('[data-modal="create-pet-antecedent"]');

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
  const esModal = !location.hash.includes("antecedente/crear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const antecedentResponse = await post("antecedentes", {
      ...datos,
      mascota_id: mascota.id,
    });

    if (!antecedentResponse.success)
      return await error(antecedentResponse.message);

    const contenedorAntecedente = DOMSelector("#profile-pet-antecedent");

    if (contenedorAntecedente) {
      const bloqueAntecedenteCreado = await crearBloqueAntecedenteCompleto(
        antecedentResponse.data
      );

      contenedorAntecedente.insertAdjacentElement(
        "afterbegin",
        bloqueAntecedenteCreado
      );
      const placeholderAnterior = DOMSelector(".placeholder-antecedentes");
      if (placeholderAnterior) placeholderAnterior.remove();
    }

    successTemporal(antecedentResponse.message);

    cerrarModal("create-pet-antecedent");
    history.back();
  });

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-register-pet-antecedent") {
      cerrarModal("create-pet-antecedent");
      // location.hash = `#/mascotas/perfil/id=${mascota.id}`;
      console.log("si");

      history.back();
    }
  });
};
