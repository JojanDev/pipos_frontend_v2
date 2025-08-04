import { error } from "../../../../helpers/alertas";
import { convertirADiaMesAño } from "../../../../helpers/antecedentes";
import { get } from "../../../../helpers/api";
import { crearFila } from "../../../../helpers/crearFila";
import {
  cerrarModal,
  cerrarModalYVolverAVistaBase,
} from "../../../../helpers/modal";

export const treatmentController = async (parametros = null) => {
  const { id, tituloAntecedente } = parametros;
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

  tituloTratamiento.textContent = titulo;
  fechaTratamiento.textContent = convertirADiaMesAño(fecha_creado);
  descripcionTratamiento.textContent = descripcion;

  if (tbody) {
    const responseMedicamentos = await get(
      `medicamentos/tratamiento/${responseTratamiento.data.id}`
    );

    if (responseMedicamentos.success) {
      responseMedicamentos.data.forEach((medicamentoTratamiento) => {
        const { medicamento, dosis, duracion, frecuencia_aplicacion } =
          medicamentoTratamiento;

        const row = crearFila([
          medicamento.id,
          medicamento.nombre,
          medicamento.uso_general,
          medicamento.via_administracion,
          dosis,
          frecuencia_aplicacion,
          duracion,
        ]);

        tbody.append(row);
      });
    }
  }

  modal.addEventListener("click", (e) => {
    console.log(e.target);

    if (e.target.id == "back-treatment") {
      esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
    }
  });
};
