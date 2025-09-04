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
  console.log(parametros);

  // const { id } = parametros;
  const { perfil: infoMedicamento } = parametros;

  const contenedorVista = DOMSelector(
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

  const response = await get(`info-medicamentos/${infoMedicamento.id}`);

  console.log(response);

  if (!response.success) {
    await error(response.message);
    cerrarModal("profile-medicament-info")
    history.back();


    return;
  }

  mapearDatosEnContenedor(response.data, contenedorVista);

  contenedorVista.addEventListener('click', async (e) => {
    if (e.target.id == "back-profile-medicament-info") {
      cerrarModal("profile-medicament-info")
      history.back();
    }

    if (e.target.id == "edit-medicament-info") {
      // await cargarComponente(routes.medicamentos_info.editar, {
      //   id: response.data.id,
      // });

      location.hash = (location.hash + (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`));

    }

    if (e.target.id == "delete-medicament-info") {
      const eliminado = await del("medicamentos/info/" + infoMedicamento.id);

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

      successTemporal(eliminado.message);

      cerrarModal("profile-medicament-info")
      history.back();
    }
  })
};
