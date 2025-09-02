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
} from "../../../helpers";

export const createAntecedentController = (parametros = null) => {
  const { id } = parametros;

  const containerPerfilMascota = DOMSelector(".contenedor-perfil--pet");

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
      mascota_id: id,
    });

    if (!antecedentResponse.success)
      return await error(antecedentResponse.message);

    const contenedorAntecedente = DOMSelector("#profile-pet-antecedent");

    if (contenedorAntecedente) {
      const bloqueAntecedenteCreado = crearBloqueAntecedenteCompleto(
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

    esModal
      ? cerrarModal("create-pet-antecedent")
      : cerrarModalYVolverAVistaBase();
  });

  configurarBotonCerrar("back-register-pet-antecedent", esModal);
};
