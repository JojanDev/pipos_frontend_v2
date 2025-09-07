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
  successTemporal,
  convertirDias,
} from "../../../helpers";
import hasPermission from "../../../helpers/hasPermission";
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
  console.log(parametros);
  const { perfil: tratamiento, antecedente } = parametros;

  const contenedorVista = DOMSelector('[data-modal="pet-treatment"]');

  const modal = DOMSelector('[data-modal="pet-treatment"]');
  const esModal = !location.hash.includes("antecedente/tratamiento");
  const tbody = DOMSelector("#pet-antecedent-treatment .table__body");

  const tratamientoResponse = await get(`tratamientos/${tratamiento.id}`);
  const { data: veterinario } = await get(
    `usuarios/${tratamientoResponse.data.usuario_id}`
  );

  if (!tratamientoResponse.success) {
    await error(tratamientoResponse.message);
    cerrarModal("create-client");
    history.back();
  }

  const antecedenteResponse = await get(`antecedentes/${antecedente.id}`);

  mapearDatosEnContenedor(
    {
      ...tratamientoResponse.data,
      veterinario: veterinario.nombre,
      "titulo-antecedente": antecedenteResponse.data.titulo,
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

        iconDelete.dataset.permiso = "medicamento-tratamiento.delete";

        const iconEdit = document.createElement("i");

        iconEdit.classList.add("ri-edit-box-line", "edit-tabla", "btn--orange");

        iconEdit.dataset.permiso = "medicamento-tratamiento.update";

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
          convertirDias(duracion),
          iconDelete,
          iconEdit,
        ]);

        tbody.append(row);
      }
    );
  } else {
    errorTemporal(responseMedicamentos.message);
  }

  const getMascota = await get(
    `mascotas/${antecedenteResponse.data.mascota_id}`
  );

  if (!getMascota.data.estado_vital) {
    desactivarBotonesPerfilTratamiento();
  }

  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  modal.addEventListener("click", async (e) => {
    if (e.target.id == "register-antecedent-treatment-medicament") {
      console.log("location.hash", location.hash);

      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? +"medicamento/crear"
          : "/medicamento/crear");
      console.log("location.hash", location.hash);
    }

    if (e.target.id == "back-treatment") {
      cerrarModal("pet-treatment");
      history.back();
    }

    if (e.target.classList.contains("delete-tabla")) {
      const medicament = e.target.closest(`[data-id]`);
      const idMedicament = medicament.getAttribute("data-id");

      const responseDelete = await del(
        `medicamentos-tratamientos/${idMedicament}`
      );

      if (!responseDelete.success) {
        await error(responseDelete.message);
        return;
      }

      medicament.remove();

      successTemporal(responseDelete.message);
    }

    if (e.target.classList.contains("edit-tabla")) {
      const medicament = e.target.closest(`[data-id]`);
      const idMedicament = medicament.getAttribute("data-id");

      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? +`medicamento/editar/id=${idMedicament}`
          : `/medicamento/editar/id=${idMedicament}`);
      // await cargarComponente(routes.antecedente.medicamentoEditar, {
      //   id: idMedicament,
      // });
    }

    if (e.target.id == "delete-treatment") {
      const responseDelete = await del(`tratamientos/${tratamiento.id}`);

      if (!responseDelete.success) return await error(responseDelete.message);

      // const idAntecedente = fila.getAttribute("data-id");
      eliminarTratamiento(tratamiento.id, antecedente.id);

      successTemporal(responseDelete.message);
      cerrarModal("pet-treatment");
      history.back();
    }

    if (e.target.id == "edit-treatment") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? +"editar"
          : "/editar");

      // await cargarComponente(routes.antecedente.tratamientoEditar, {
      //   tratamiento_id: id,
      // });
    }
  });
};
