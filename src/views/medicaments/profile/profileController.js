import { routes } from "../../../router/routes";
import {
  error,
  get,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  convertirADiaMesAño,
  formatearPrecioConPuntos,
  del,
  successTemporal,
} from "../../../helpers";
import { crearCartaMedicamento } from "../medicamentsController";

export const asignarDatosMedicamentoInfo = (data) => {
  const spanNombre = document.querySelector("#profile-medicament-info-nombre");
  const spanUsoGeneral = document.querySelector(
    "#profile-medicament-info-usoGeneral"
  );
  const spanVia = document.querySelector("#profile-medicament-info-Via");
  const spanPresentacion = document.querySelector(
    "#profile-medicament-info-presentacion"
  );
  const spanAdicional = document.querySelector(
    "#profile-medicament-info-adicionl"
  );

  const {
    nombre,
    uso_general,
    via_administracion,
    presentacion,
    informacion_adicional,
  } = data;

  spanNombre.textContent = nombre;
  spanUsoGeneral.textContent = uso_general;
  spanVia.textContent = via_administracion;
  spanPresentacion.textContent = presentacion;
  spanAdicional.textContent = informacion_adicional;
};

export const profileMedicamentInfoController = async (parametros = null) => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);

  if (data.id_rol != 1) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }

  const tbody = document.querySelector("#pets-client .table__body");
  const btnAtras = document.querySelector("#back-profile-medicament-info");
  const esModal = !location.hash.includes("medicamentos_info/perfil");

  const { id } = parametros;

  const response = await get(`medicamentos/info/${id}`);

  console.log(response);

  if (!response.success) {
    await error(response.message);
    esModal
      ? cerrarModal("profile-medicament-info")
      : cerrarModalYVolverAVistaBase();

    return;
  }

  asignarDatosMedicamentoInfo(response.data);

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("profile-medicament-info")
      : cerrarModalYVolverAVistaBase();
  });

  const btnEdit = document.querySelector("#edit-medicament-info");

  btnEdit.addEventListener("click", async () => {
    await cargarComponente(routes.medicamentos_info.editar, {
      id: response.data.id,
    });
  });

  const btnDelete = document.querySelector("#delete-medicament-info");

  btnDelete?.addEventListener("click", async () => {
    const eliminado = await del("medicamentos/info/" + id);

    console.log(eliminado);
    if (!eliminado.success) {
      await error(eliminado.message);
      return;
    }

    const contenedor = document.querySelector("#medicaments-info");
    contenedor.innerHTML = "";

    const responseAll = await get("medicamentos/info");

    responseAll.data.forEach((medicamento) => {
      const carta = crearCartaMedicamento(medicamento);
      contenedor.appendChild(carta);
    });

    await successTemporal(eliminado.message);

    esModal
      ? cerrarModal("profile-medicament-info")
      : cerrarModalYVolverAVistaBase();
  });
};
