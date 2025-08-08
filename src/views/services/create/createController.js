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

  console.log(form);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    // datos["id_antecedente"] = idAntecedente;
    console.log(datos);

    const responseServicios = await post("servicios", datos);

    console.log(responseServicios);

    if (!responseServicios.success) {
      await error(responseServicios.message);
      return;
    }

    const containerCards = document.querySelector("#services");

    if (containerCards) {
      const { id, nombre, descripcion } = responseServicios.data;

      const card = crearCardServicio(id, nombre, descripcion);
      containerCards.insertAdjacentElement("afterbegin", card);
    }

    await success(responseServicios.message);

    esModal ? cerrarModal("create-service") : cerrarModalYVolverAVistaBase();
  });

  const btnAtras = document.querySelector("#back-register-service");

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("create-service") : cerrarModalYVolverAVistaBase();
  });
};
