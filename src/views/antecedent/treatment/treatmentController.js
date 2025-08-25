import {
  error,
  convertirADiaMesAño,
  get,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  capitalizarPrimeraLetra,
  del,
  success,
  mostrarMensajeSiNoHayTratamientos,
} from "../../../helpers";
import { routes } from "../../../router/routes";

function eliminarTratamiento(idTratamiento, idAntecedente) {
  const tratamiento = document.querySelector(
    `[data-idTratamiento='${idTratamiento}']`
  );
  if (tratamiento) {
    tratamiento.remove();
    mostrarMensajeSiNoHayTratamientos(idAntecedente);
  }
}

const desactivarBotonesPerfilTratamiento = () => {
  // Botones fijos del perfil de tratamiento
  const botones = [
    "#register-antecedent-treatment-medicament", // Agregar medicamento
    "#delete-treatment", // Eliminar tratamiento
    "#edit-treatment",
  ];

  botones.forEach((selector) => {
    const boton = document.querySelector(selector);
    if (boton) boton.remove();
  });

  // Botones de eliminar medicamento dentro de la tabla
  const botonesEliminarMedicamento = document.querySelectorAll(".delete-tabla");
  botonesEliminarMedicamento.forEach((btn) => btn.remove());

  const botonesEditMedicamento = document.querySelectorAll(".edit-tabla");
  botonesEditMedicamento.forEach((btn) => btn.remove());
};

export const treatmentController = async (parametros = null) => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  if (data.id_rol != 1) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }
  const { id, tituloAntecedente, estado_vital } = parametros;

  const modal = document.querySelector('[data-modal="pet-treatment"]');
  const esModal = !location.hash.includes("antecedente/tratamiento");
  const tbody = document.querySelector(
    "#pet-antecedent-treatment .table__body"
  );

  const tituloTratamiento = document.querySelector("#treatment-title");
  const fechaTratamiento = document.querySelector("#treatment-date");
  const vetTratamiento = document.querySelector("#treatment-veterinario");
  const descripcionTratamiento = document.querySelector(
    "#treatment-description"
  );

  const titleAntecedent = document.querySelector("#treatment-title-antecedent");

  titleAntecedent.textContent = "Tratamiento para: " + tituloAntecedente;

  const responseTratamiento = await get(`tratamientos/${id}`);
  const veterinario = await get(
    "personal/" + responseTratamiento.data.id_personal
  );

  vetTratamiento.textContent =
    "Veterinario asociado: " + veterinario.data.info.nombre;

  if (!responseTratamiento.success) {
    await error(responseTratamiento.message);
    esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  }

  const { titulo, descripcion, fecha_creado } = responseTratamiento.data;

  tituloTratamiento.textContent = titulo;
  fechaTratamiento.textContent = convertirADiaMesAño(fecha_creado);
  descripcionTratamiento.textContent = descripcion;

  if (tbody) {
    const responseMedicamentos = await get(
      `medicamentos/tratamiento/${responseTratamiento.data.id}`
    );

    if (responseMedicamentos.success) {
      responseMedicamentos.data.forEach((medicamentoTratamiento) => {
        const {
          id,
          medicamento,
          dosis,
          duracionFormateada,
          frecuencia_aplicacion,
        } = medicamentoTratamiento;

        const iconDelete = document.createElement("i");

        iconDelete.classList.add(
          "ri-delete-bin-line",
          "delete-tabla",
          "btn--red",
          "admin"
        );

        const iconEdit = document.createElement("i");

        iconEdit.classList.add("ri-edit-box-line", "edit-tabla", "btn--orange");

        const row = crearFila([
          id,
          medicamento.nombre,
          medicamento.uso_general,
          capitalizarPrimeraLetra(medicamento.via_administracion),
          dosis,
          frecuencia_aplicacion,
          duracionFormateada[1],
          data.id_rol == 1 ? iconDelete : "",
          iconEdit,
        ]);

        tbody.append(row);
      });
    }
  }
  console.log(estado_vital);

  if (!estado_vital) {
    desactivarBotonesPerfilTratamiento();
  }

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "register-antecedent-treatment-medicament") {
      await cargarComponente(routes.antecedente.medicamento, {
        idTratamiento: id,
      });
    }

    if (e.target.id == "back-treatment") {
      esModal ? cerrarModal("pet-treatment") : cerrarModalYVolverAVistaBase();
    }

    if (e.target.classList.contains("delete-tabla")) {
      const medicament = e.target.closest(`[data-id]`);
      const idMedicament = medicament.getAttribute("data-id");

      const responseDelete = await del(
        "medicamentos/tratamiento/" + idMedicament
      );

      if (!responseDelete.success) {
        await error(responseDelete.message);
        return;
      }

      medicament.remove();
      // const idAntecedente = fila.getAttribute("data-id");

      // esModal ? cerrarModal("pet-treatment") : cerrarModalYVolverAVistaBase();
      // history.replaceState(null, "", `#/mascotas/perfil`);
      await success(responseDelete.message);
      // esModal ? cerrarModal("pet-treatment") : cerrarModalYVolverAVistaBase();
    }

    if (e.target.classList.contains("edit-tabla")) {
      const medicament = e.target.closest(`[data-id]`);
      const idMedicament = medicament.getAttribute("data-id");

      await cargarComponente(routes.antecedente.medicamentoEditar, {
        id: idMedicament,
      });
    }

    if (e.target.id == "delete-treatment") {
      const responseDelete = await del("tratamientos/" + id);

      if (!responseDelete.success) {
        await error(responseDelete.message);
        return;
      }

      // const idAntecedente = fila.getAttribute("data-id");
      eliminarTratamiento(id, responseTratamiento.data.id_antecedente);

      esModal ? cerrarModal("pet-treatment") : cerrarModalYVolverAVistaBase();
      // history.replaceState(null, "", `#/mascotas/perfil`);
      await success(responseDelete.message);
    }

    if (e.target.id == "edit-treatment") {
      await cargarComponente(routes.antecedente.tratamientoEditar, { id });
    }
  });
};
