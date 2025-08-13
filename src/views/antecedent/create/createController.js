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
} from "../../../helpers";

export const createAntecedentController = (parametros = null) => {
  const { id } = parametros;

  const containerPerfilMascota = document.querySelector(
    ".contenedor-perfil--pet"
  );

  const selectPets = document.querySelector("#select-pets");

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

  const form = document.querySelector("#form-register-pet-antecedent");
  const esModal = !location.hash.includes("antecedente/crear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const containerSelectPet = document
      .querySelector("#container-select-pets")
      .classList.contains("hidden")
      ? false
      : true;

    if (!validarCampos(e)) return;

    datos["id_mascota"] = id;

    const responseAntecedente = await post("antecedentes", datos);

    if (!responseAntecedente.success) {
      await error(responseAntecedente.message);
      return;
    }

    const contenedorAntecedente = document.querySelector(
      "#profile-pet-antecedent"
    );

    if (contenedorAntecedente) {
      const bloqueAntecedenteCreado = crearBloqueAntecedenteCompleto(
        responseAntecedente.data
      );
      contenedorAntecedente.insertAdjacentElement(
        "afterbegin",
        bloqueAntecedenteCreado
      );
      const placeholderAnterior = document.querySelector(
        ".placeholder-antecedentes"
      );
      if (placeholderAnterior) placeholderAnterior.remove();
    }

    await success(responseAntecedente.message);

    esModal
      ? cerrarModal("create-pet-antecedent")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-register-pet-antecedent");

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("create-pet-antecedent")
      : cerrarModalYVolverAVistaBase();
  });
};
