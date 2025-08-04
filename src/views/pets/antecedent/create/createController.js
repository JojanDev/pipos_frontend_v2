import { error, success } from "../../../../helpers/alertas";
import { crearBloqueAntecedenteCompleto } from "../../../../helpers/antecedentes";
import { post } from "../../../../helpers/api";
import { llenarSelect } from "../../../../helpers/cargarTiposDocumento";
import { cerrarModalYVolverAVistaBase } from "../../../../helpers/modal";
import {
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../../helpers/validaciones";

export const createAntecedentController = (parametros = null) => {
  const { id } = parametros;

  const containerPerfilMascota = document.querySelector(
    ".contenedor-perfil--pet"
  );

  console.log(containerPerfilMascota);
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

  console.log(form);

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
    }

    await success(responseAntecedente.message);

    // esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-register-pet-antecedent");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
  });
};
