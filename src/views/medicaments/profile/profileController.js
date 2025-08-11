import { routes } from "../../../../router/routes";
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
} from "../../../../helpers";

const asignarDatosMedicamentoInfo = (data) => {
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

export const profileMedicamentController = async (parametros = null) => {
  const tbody = document.querySelector("#pets-client .table__body");
  const btnAtras = document.querySelector("#back-profile-medicament-info");
  const esModal = !location.hash.includes("medicamentos_info/perfil");

  console.log(btnAtras);

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
    console.log("BOTON");

    esModal
      ? cerrarModal("profile-medicament-info")
      : cerrarModalYVolverAVistaBase();
  });

  const btnEdit = document.querySelector("#edit-medicament-info");

  btnEdit.addEventListener("click", async () => {
    await cargarComponente(
      routes.medicamentos_info.editar,
      response.data.info.id
    );
  });
};
