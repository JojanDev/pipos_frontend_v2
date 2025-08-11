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

export const treatmentController = async (parametros = null) => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);
  console.log(data);

  if (data.id_rol == 2) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }
  const { id, tituloAntecedente } = parametros;
  console.log(parametros);

  const modal = document.querySelector('[data-modal="pet-treatment"]');
  const esModal = !location.hash.includes("antecedente/tratamiento");
  const tbody = document.querySelector(
    "#pet-antecedent-treatment .table__body"
  );
  console.log(tbody);

  const tituloTratamiento = document.querySelector("#treatment-title");
  const fechaTratamiento = document.querySelector("#treatment-date");
  const descripcionTratamiento = document.querySelector(
    "#treatment-description"
  );

  const titleAntecedent = document.querySelector("#treatment-title-antecedent");
  console.log(titleAntecedent);

  titleAntecedent.textContent = "Tratamiento para: " + tituloAntecedente;

  const responseTratamiento = await get(`tratamientos/${id}`);

  if (!responseTratamiento.success) {
    await error(responseTratamiento.message);
    esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  }

  const { titulo, descripcion, fecha_creado } = responseTratamiento.data;
  console.log(responseTratamiento);

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
        // spanTitulo.textContent = titulo;
        iconDelete.classList.add(
          "ri-delete-bin-line",
          "delete-tabla",
          "btn--red",
          "admin"
        );

        const row = crearFila([
          id,
          medicamento.nombre,
          medicamento.uso_general,
          capitalizarPrimeraLetra(medicamento.via_administracion),
          dosis,
          frecuencia_aplicacion,
          duracionFormateada[1],
          iconDelete,
        ]);

        tbody.append(row);
      });
    }
  }

  modal.addEventListener("click", async (e) => {
    console.log(e.target);

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
  });
};
