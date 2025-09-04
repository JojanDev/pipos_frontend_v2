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
  convertirEdadCorta,
} from "../../../helpers";

export const profileClientController = async (parametros = null) => {
  console.log(parametros);

  const tbody = DOMSelector("#pets-client .table__body");
  const esModal = !location.hash.includes("clientes/perfil");
  const profileClient = DOMSelector(`[data-modal="profile-client"]`);

  const { perfil: usuario } = parametros;
  const id = usuario.id;

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

  const petsUserResponse = await get(`mascotas/usuario/${id}`);

  console.log(petsUserResponse);

  if (!petsUserResponse.success) errorTemporal(petsUserResponse.message);

  if (petsUserResponse.success) {
    if (tbody) {
      petsUserResponse.data.forEach(
        ({ id, edad_semanas, nombre, raza, especie, sexo, estado_vital }) => {
          const row = crearFila([
            id,
            nombre,
            especie,
            raza,
            convertirEdadCorta(edad_semanas),
            capitalizarPrimeraLetra(sexo),
          ]);

          !estado_vital ? row.classList.add("fila-roja") : null;

          tbody.insertAdjacentElement("afterbegin", row);
        }
      );
    }
  }

  profileClient.addEventListener("click", async (e) => {
    if (e.target.id == "register-pets-client") {
      await cargarComponente(routes.mascotas.crear, id);
      const selectCliente = DOMSelector("#select-clients");
      const contenedor = selectCliente?.closest(".form__container-field");
      contenedor.classList.add("hidden");
    }

    if (e.target.id == "edit-client")
      // await cargarComponente(routes.clientes.editar, { id });
      location.hash = `#/clientes/perfil/id=${id}/editar`;

    if (e.target.id == "back-perfil") {
      cerrarModal("profile-client");
      location.hash = `#/clientes`;
    }
  });

  // configurarBotonCerrar("back-perfil", esModal);
};
