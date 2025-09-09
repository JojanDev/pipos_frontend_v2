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
import hasPermission from "../../../helpers/hasPermission";

export const profileClientController = async (parametros = null) => {
  console.log(parametros);

  const tbody = DOMSelector("#pets-client .table__body");
  const contenedorVista = DOMSelector(`[data-modal="profile-client"]`);

  const { perfil: usuario } = parametros;
  const id = usuario.id;

  const userResponse = await get(`usuarios/${id}`);

  if (!userResponse.success) {
    await error(userResponse.message);
    history.back();

    return;
  }

  const typeDocumentResponse = await get(
    "tipos-documentos/" + userResponse.data.tipo_documento_id
  );
  userResponse.data["tipo_documento"] = typeDocumentResponse.data.nombre;
  userResponse.data["cliente"] = `${userResponse.data.nombre} ${userResponse.data.apellido}`;

  mapearDatosEnContenedor(userResponse.data, contenedorVista);

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
            edad_semanas ? convertirEdadCorta(edad_semanas) : "Desconocida",
            capitalizarPrimeraLetra(sexo),
          ]);

          !estado_vital ? row.classList.add("fila-roja") : null;

          tbody.insertAdjacentElement("afterbegin", row);
        }
      );
    }
  }

  const [...acciones] = contenedorVista.querySelectorAll(`[data-permiso]`);

  console.log(acciones);

  for (const accion of acciones) {
    console.log(accion.dataset.permiso.split(","));
    console.log(hasPermission(accion.dataset.permiso.split(",")));
    if (!hasPermission(accion.dataset.permiso.split(","))) {
      accion.remove();
    }
  }

  contenedorVista.addEventListener("click", async (e) => {
    if (e.target.id == "register-pets-client") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/"
          ? `mascotas/crear`
          : `/mascotas/crear`);
    }

    if (e.target.id == "edit-client") {
      location.hash =
        location.hash +
        (location.hash[location.hash.length - 1] == "/" ? `editar` : `/editar`);
    }

    if (e.target.id == "back-perfil") {
      cerrarModal("profile-client");
      history.back();
    }
  });
};
