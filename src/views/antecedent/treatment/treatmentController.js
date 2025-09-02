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
  DOMSelector,
  DOMSelectorAll,
  errorTemporal,
  mapearDatosEnContenedor,
} from "../../../helpers";
import { routes } from "../../../router/routes";

function eliminarTratamiento(idTratamiento, idAntecedente) {
  const tratamiento = DOMSelector(`[data-idTratamiento='${idTratamiento}']`);
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
    const boton = DOMSelectorAll(selector);
    if (boton) boton.remove();
  });

  // Botones de eliminar medicamento dentro de la tabla
  const botonesEliminarMedicamento = DOMSelectorAll(".delete-tabla");
  botonesEliminarMedicamento.forEach((btn) => btn.remove());

  const botonesEditMedicamento = DOMSelectorAll(".edit-tabla");
  botonesEditMedicamento.forEach((btn) => btn.remove());
};

export const treatmentController = async (parametros = null) => {
  // const dataJSON = localStorage.getItem("data");
  // const data = JSON.parse(dataJSON);

  // if (data.id_rol != 1) {
  //   const opcionesAdmin = DOMSelectorAll(".admin");
  //   [...opcionesAdmin].forEach((element) => {
  //     element.remove();
  //   });
  // }
  const { id, tituloAntecedente, estado_vital } = parametros;

  const modal = DOMSelector('[data-modal="pet-treatment"]');
  const esModal = !location.hash.includes("antecedente/tratamiento");
  const tbody = DOMSelector("#pet-antecedent-treatment .table__body");

  const tratamientoResponse = await get(`tratamientos/${id}`);
  const { data: veterinario } = await get(
    `usuarios/${tratamientoResponse.data.usuario_id}`
  );

  if (!tratamientoResponse.success) {
    await error(tratamientoResponse.message);
    esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  }

  // tituloTratamiento.textContent = titulo;
  // fechaTratamiento.textContent = convertirADiaMesAño(fecha_creado);
  // descripcionTratamiento.textContent = descripcion;

  mapearDatosEnContenedor(
    {
      ...tratamientoResponse.data,
      veterinario: veterinario.nombre,
      "titulo-antecedente": tituloAntecedente,
    },
    modal
  );

  const responseMedicamentos = await get(
    `medicamentos-tratamientos/tratamiento/${tratamientoResponse.data.id}`
  );

  if (responseMedicamentos.success) {
    responseMedicamentos.data.forEach(
      async ({
        id,
        info_medicamento_id,
        dosis,
        duracion,
        frecuencia_aplicacion,
      }) => {
        const iconDelete = document.createElement("i");

        iconDelete.classList.add(
          "ri-delete-bin-line",
          "delete-tabla",
          "btn--red",
          "admin"
        );

        const iconEdit = document.createElement("i");

        iconEdit.classList.add("ri-edit-box-line", "edit-tabla", "btn--orange");

        const { data: infoMedicamento } = await get(
          `info-medicamentos/${info_medicamento_id}`
        );

        const row = crearFila([
          id,
          infoMedicamento.nombre,
          infoMedicamento.uso_general,
          capitalizarPrimeraLetra(infoMedicamento.via_administracion),
          dosis,
          frecuencia_aplicacion,
          duracion,
          iconDelete,
          iconEdit,
        ]);

        tbody.append(row);
      }
    );
  } else {
    errorTemporal(responseMedicamentos.message);
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
      eliminarTratamiento(id, tratamientoResponse.data.id_antecedente);

      esModal ? cerrarModal("pet-treatment") : cerrarModalYVolverAVistaBase();
      // history.replaceState(null, "", `#/mascotas/perfil`);
      await success(responseDelete.message);
    }

    if (e.target.id == "edit-treatment") {
      await cargarComponente(routes.antecedente.tratamientoEditar, {
        tratamiento_id: id,
      });
    }
  });
};
