import {
  error,
  convertirADiaMesAño,
  get,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
} from "../../../helpers";
import { routes } from "../../../router/routes";

export const treatmentController = async (parametros = null) => {
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

  modal.addEventListener("click", async (e) => {
    console.log(e.target);

    if (e.target.id == "register-antecedent-treatment-medicament") {
      await cargarComponente(routes.antecedente.medicamento, {
        idTratamiento: id,
      });
    }

    if (e.target.id == "back-treatment") {
      esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
    }
  });
};
