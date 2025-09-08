import {
  error,
  loginSuccess,
  success,
  get,
  post,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  llenarSelect,
  crearFila,
  cerrarModalYVolverAVistaBase,
  cerrarModal,
  successTemporal,
} from "../../../helpers";

export const createClienteExistController = async () => {
  const form = document.querySelector("#form-register-clienteExist");

  const esModal = !location.hash.includes("clientes/crearExistente");

  await llenarSelect({
    endpoint: "usuarios/no-clientes",
    selector: "#select-info",
    optionMapper: (usuario) => ({
      id: usuario.id,
      text: `${usuario.numero_documento} - ${usuario.nombre}`,
    }),
  });

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    const response = await post("roles-usuarios/", { ...datos, rol_id: 3 });

    //Se valida el inicio exitoso
    if (!response.success) {
      //Se muestra un mensaje
      await error(response.message);
      return;
    }

    const tbody = document.querySelector("#clients .table__body");
    if (tbody) {
      const { data: usuario } = await get(
        `usuarios/${response.data.usuario_id}`
      );
      const { id, nombre, telefono, numero_documento, direccion } = usuario;

      const row = crearFila([
        id,
        nombre,
        telefono,
        numero_documento,
        direccion,
      ]);

      tbody.insertAdjacentElement("afterbegin", row);
    }

    successTemporal(response.message);

    cerrarModal("create-clienteExist");
    history.back();
  });

  const btnAtras = document.querySelector("#back-create-clienteExist");

  btnAtras.addEventListener("click", () => {
    cerrarModal("create-clienteExist");
    history.back();
  });
};
