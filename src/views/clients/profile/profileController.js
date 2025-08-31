import { routes } from "../../../router/routes";
import {
  error,
  get,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
  mapearDatosEnContenedor,
  DOMSelector,
  configurarBotonCerrar,
  errorTemporal,
} from "../../../helpers";

export const profileClientController = async (parametros = null) => {
  const tbody = DOMSelector("#pets-client .table__body");
  const esModal = !location.hash.includes("clientes/perfil");
  const profileClient = DOMSelector(`[data-modal="profile-client"]`);

  const { id } = parametros;

  const userResponse = await get(`usuarios/${id}`);

  if (!userResponse.success) {
    await error(userResponse.message);
    cerrarModalYVolverAVistaBase();
    return;
  }

  const typeDocumentResponse = await get(
    "tipos-documentos/" + userResponse.data.tipo_documento_id
  );
  userResponse.data["tipo_documento"] = typeDocumentResponse.data.nombre;
  userResponse.data["cliente"] = userResponse.data.nombre;

  mapearDatosEnContenedor(userResponse.data, profileClient);

  const userResponseMascotas = await get(`mascotas/cliente/${id}`);

  console.log(userResponseMascotas);

  if (!userResponseMascotas.success)
    errorTemporal(userResponseMascotas.message);

  if (userResponseMascotas.success) {
    if (tbody) {
      userResponseMascotas.data.forEach(
        ({ id, edadFormateada, nombre, raza, sexo, estado_vital }) => {
          const row = crearFila([
            id,
            nombre,
            raza.especie.nombre,
            raza.nombre,
            edadFormateada,
            capitalizarPrimeraLetra(sexo),
          ]);

          !estado_vital ? row.classList.add("fila-roja") : null;

          tbody.insertAdjacentElement("afterbegin", row);
        }
      );
    }
  }

  profileClient.addEventListener("click", async (e) => {
    if (e.target.id == "back-perfil")
      configurarBotonCerrar("back-perfil", esModal);

    if (e.target.id == "register-pets-client") {
      await cargarComponente(routes.mascotas.crear, id);
      const selectCliente = DOMSelector("#select-clients");
      const contenedor = selectCliente?.closest(".form__container-field");
      contenedor.classList.add("hidden");
    }

    if (e.target.id == "edit-client")
      await cargarComponente(routes.clientes.editar, { id });
  });
};
