import {
  error,
  success,
  post,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelect,
  crearFila,
  cerrarModalYVolverAVistaBase,
  capitalizarPrimeraLetra,
} from "../../../helpers";

export const createPersonalExistController = async () => {
  const form = document.querySelector("#form-register-personalExist");
  const esModal = !location.hash.includes("personal/crearExistente");

  llenarSelect({
    endpoint: "clientes/noEmpleados",
    selector: "#select-info",
    optionMapper: (info) => ({
      id: info.id,
      text: `${info.numero_documento} - ${info.nombre}`,
    }),
  });

  llenarSelect({
    endpoint: "roles",
    selector: "#select-roles",
    optionMapper: (rol) => ({
      id: rol.id,
      text: capitalizarPrimeraLetra(rol.nombre),
    }),
  });
  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await post("personal/infoExistente", datos);

    //Se valida el inicio exitoso
    if (!response.success) {
      //Se muestra un mensaje
      await error(response.message);
      return;
    }

    await success(response.message);

    const tbody = document.querySelector("#personal .table__body");

    if (tbody) {
      const info = response.data.info;

      const row = crearFila([
        response.data.id,
        response.data.usuario,
        capitalizarPrimeraLetra(response.data.rol.nombre),
        info.nombre,
        info.telefono,
        info.numeroDocumento,
        info.direccion,
      ]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    cerrarModal("create-personalExist");
    history.back();
  });

  const btnAtras = document.querySelector("#back-create-personalExist");

  btnAtras.addEventListener("click", () => {
    cerrarModal("create-personalExist");
    history.back();
  });
};
