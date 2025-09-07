import {
  success,
  post,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  error,
  cerrarModal,
  DOMSelector,
  configurarBotonCerrar,
  DOMSelectorAll,
  successTemporal,
} from "../../../helpers";
import { crearCardServicio } from "../servicesController";

export const createServiceController = (parametros = null) => {
  const form = DOMSelector("#form-register-service");
  const esModal = !location.hash.includes("servicios/crear");

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const responseServicios = await post("servicios", datos);

    if (!responseServicios.success) {
      await error(responseServicios.message);
      return;
    }

    const containerCards = DOMSelector("#services");

    if (containerCards) {
      const { id, nombre, descripcion, precio } = responseServicios.data;

      const card = crearCardServicio(id, nombre, descripcion, precio);
      containerCards.insertAdjacentElement("afterbegin", card);
      const placeholderAnterior = DOMSelector(".placeholder");
      if (placeholderAnterior) placeholderAnterior.remove();
    }

    successTemporal(responseServicios.message);

    cerrarModal("create-service");
    history.back();
  });

  const contenedorVista = DOMSelector(`[data-modal="create-service"]`);

  contenedorVista.addEventListener("click", (e) => {
    if (e.target.id == "back-register-service") {
      cerrarModal("create-service");
      history.back();
    }
  });
};
