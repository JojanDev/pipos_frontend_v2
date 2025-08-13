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

export const editSpecieController = (parametros = null) => {
  // Id de la especie
  const { id, nombre } = parametros;

  const form = document.querySelector("#form-edit-specie");
  const esModal = !location.hash.includes("especiesEditar");

  const titulo = document.querySelector("#nombreSpecie");

  titulo.value = nombre;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;

    if (nombre == datos.nombre) {
      esModal ? cerrarModal("edit-specie") : cerrarModalYVolverAVistaBase();

      return;
    }

    const responseEspecie = await put(`especies/${id}`, datos);

    if (!responseEspecie.success) {
      await error(responseEspecie.message);
      return;
    }

    await success(responseEspecie.message);
    // Justo después de insertar la nueva fila:
    const nombreEspecieFila = document.querySelector(
      `#species [data-id="${id}"] td:nth-child(2)`
    );

    const titulo = document.querySelector("#specie-title");

    titulo.textContent = responseEspecie.data.nombre;

    if (nombreEspecieFila) {
      nombreEspecieFila.textContent = responseEspecie.data.nombre;
    }

    esModal ? cerrarModal("edit-specie") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-edit-specie");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("edit-specie") : cerrarModalYVolverAVistaBase();
  });
};
