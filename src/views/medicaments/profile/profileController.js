import { routes } from "../../../router/routes";
import {
  error,
  get,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  del,
  successTemporal,
  mapearDatosEnContenedor,
  DOMSelector,
} from "../../../helpers";
import { crearCartaMedicamento } from "../medicamentsController";

export const profileMedicamentInfoController = async (parametros = null) => {
  const contenedorPerfil = DOMSelector(
    `[data-modal="profile-medicament-info"]`
  );
  // const dataJSON = localStorage.getItem("data");
  // const data = JSON.parse(dataJSON);

  // if (data.id_rol != 1) {
  //   const opcionesAdmin = DOMSelectorAll(".admin");
  //   [...opcionesAdmin].forEach((element) => {
  //     element.remove();
  //   });
  // }

  const tbody = DOMSelector("#pets-client .table__body");
  const btnAtras = DOMSelector("#back-profile-medicament-info");
  const esModal = !location.hash.includes("medicamentos_info/perfil");

  const { id } = parametros;

  const response = await get(`info-medicamentos/${id}`);

  console.log(response);

  if (!response.success) {
    await error(response.message);
    esModal
      ? cerrarModal("profile-medicament-info")
      : cerrarModalYVolverAVistaBase();

    return;
  }

  mapearDatosEnContenedor(response.data, contenedorPerfil);

  btnAtras.addEventListener("click", () => {
    esModal
      ? cerrarModal("profile-medicament-info")
      : cerrarModalYVolverAVistaBase();
  });

  const btnEdit = DOMSelector("#edit-medicament-info");

  btnEdit.addEventListener("click", async () => {
    await cargarComponente(routes.medicamentos_info.editar, {
      id: response.data.id,
    });
  });

  const btnDelete = DOMSelector("#delete-medicament-info");

  btnDelete?.addEventListener("click", async () => {
    const eliminado = await del("medicamentos/info/" + id);

    console.log(eliminado);
    if (!eliminado.success) {
      await error(eliminado.message);
      return;
    }

    const contenedor = DOMSelector("#medicaments-info");
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
