import {
  success,
  crearElementoTratamiento,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  crearFila,
  error,
  cerrarModal,
} from "../../../helpers";
import { crearCardServicio } from "../servicesController";
// import { listarServices } from "../../administrationController";

export const createServiceController = (parametros = null) => {
  // const { idAntecedente } = parametros;

  const form = document.querySelector("#form-register-service");
  const esModal = !location.hash.includes("servicios/crear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;

    const responseServicios = await post("servicios", datos);

    if (!responseServicios.success) {
      await error(responseServicios.message);
      return;
    }

    const containerCards = document.querySelector("#services");

    if (containerCards) {
      const { id, nombre, descripcion, precio } = responseServicios.data;

      const card = crearCardServicio(id, nombre, descripcion, precio);
      containerCards.insertAdjacentElement("afterbegin", card);
      const placeholderAnterior = document.querySelector(".placeholder");
      if (placeholderAnterior) placeholderAnterior.remove();
    }

    const dataJSON = localStorage.getItem("data");
    const data = JSON.parse(dataJSON);

    if (data.id_rol != 1) {
      const opcionesAdmin = document.querySelectorAll(".admin");
      [...opcionesAdmin].forEach((element) => {
        element.remove();
      });
    }

    await success(responseServicios.message);

    esModal ? cerrarModal("create-service") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-register-service");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("create-service") : cerrarModalYVolverAVistaBase();
  });
};
