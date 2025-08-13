import {
  success,
  crearElementoTratamiento,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  crearFila,
  error,
  cerrarModal,
  put,
} from "../../../../helpers";
import { listarEspecies } from "../../administrationController";

export const editBreedController = (parametros = null) => {
  // Id de la especie
  const { id, nombre, id_especie } = parametros;

  const form = document.querySelector("#form-edit-breed");
  const esModal = !location.hash.includes("razasEditar");

  const titulo = document.querySelector("#nombreRaza");

  titulo.value = nombre;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;
    if (nombre == datos.nombre) {
      esModal ? cerrarModal("edit-breed") : cerrarModalYVolverAVistaBase();

      return;
    }

    datos["id_especie"] = id_especie;

    const responseEspecie = await put(`razas/${id}`, datos);

    if (!responseEspecie.success) {
      await error(responseEspecie.message);
      return;
    }

    await success(responseEspecie.message);
    listarEspecies();

    const titulo = document.querySelector("#breed-title");

    titulo.textContent = responseEspecie.data.nombre;

    esModal ? cerrarModal("edit-breed") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-edit-breed");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("edit-breed") : cerrarModalYVolverAVistaBase();
  });
};
