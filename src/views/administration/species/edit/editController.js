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
  configurarBotonCerrar,
  successTemporal,
  DOMSelector,
  get,
} from "../../../../helpers";

export const editSpecieController = async (parametros = null) => {
  console.log(parametros);
  const contenedorVista = DOMSelector(`[data-modal="edit-specie"]`);
  // Id de la especie
  const { perfil: especie } = parametros;
  // const { id, nombre } = parametros;

  const form = document.querySelector("#form-edit-specie");
  const esModal = !location.hash.includes("especiesEditar");

  const especieResponse = await get(`especies/${especie.id}`);
  const titulo = document.querySelector("#nombreSpecie");

  titulo.value = especieResponse.data.nombre;

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;

    if (especieResponse.data.nombre == datos.nombre) {
      cerrarModal("edit-specie");
      history.back();
      return;
    }

    const responseEspecie = await put(`especies/${especie.id}`, datos);

    if (!responseEspecie.success) return await error(responseEspecie.message);

    successTemporal(responseEspecie.message);
    // Justo después de insertar la nueva fila:
    const nombreEspecieFila = document.querySelector(
      `#species [data-id="${especie.id}"] td:nth-child(2)`
    );

    const titulo = document.querySelector("#specie-title");

    titulo.textContent = responseEspecie.data.nombre;

    if (nombreEspecieFila) {
      nombreEspecieFila.textContent = responseEspecie.data.nombre;
    }

    cerrarModal("edit-specie");
    history.back();
  });

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-edit-specie") {
      cerrarModal("edit-specie");

      // location.hash = "#/mascotas";
      history.back();
    }
  });
};
