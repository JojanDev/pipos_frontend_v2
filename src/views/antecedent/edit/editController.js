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
} from "../../../helpers";

export const editAntecedentController = async (parametros = null) => {
  const { id } = parametros;

  const containerPerfilMascota = document.querySelector(
    ".contenedor-perfil--pet"
  );

  const antecedente = await get("antecedentes/" + id);

  console.log(antecedente.data.titulo);

  document.querySelector("#titulo-antecedente-edit").value =
    antecedente.data.titulo;
  document.querySelector("#diagnostico-antecedente-edit").textContent =
    antecedente.data.diagnostico;

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

    datos["id_mascota"] = id;
    console.log(datos);

    const responseAntecedente = await put("antecedentes/" + id, {
      titulo: datos.titulo,
      diagnostico: datos.diagnostico,
    });

    if (!responseAntecedente.success) {
      await error(responseAntecedente.message);
      return;
    }

    // const contenedorAntecedente = document.querySelector(
    //   "#profile-pet-antecedent"
    // );

    // if (contenedorAntecedente) {
    //   const bloqueAntecedenteCreado = crearBloqueAntecedenteCompleto(
    //     responseAntecedente.data
    //   );
    //   contenedorAntecedente.insertAdjacentElement(
    //     "afterbegin",
    //     bloqueAntecedenteCreado
    //   );
    //   const placeholderAnterior = document.querySelector(
    //     ".placeholder-antecedentes"
    //   );
    //   if (placeholderAnterior) placeholderAnterior.remove();
    // }

    document.querySelector(
      `[data-idAntecendente="${id}"] .antecedente-titulo`
    ).textContent = responseAntecedente.data.titulo;
    document.querySelector(
      `[data-idAntecendente="${id}"] .antecedente-diagnostico`
    ).innerHTML = `<strong>Diagnóstico:</strong> ${responseAntecedente.data.diagnostico}`;

    await success(responseAntecedente.message);

    esModal
      ? cerrarModal("edit-pet-antecedent")
      : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-edit-pet-antecedent");

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("edit-pet-antecedent")
      : cerrarModalYVolverAVistaBase();
  });
};
