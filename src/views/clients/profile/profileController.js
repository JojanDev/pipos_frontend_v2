import { routes } from "../../../router/routes";
import {
  error,
  get,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  cargarComponente,
} from "../../../helpers";

const asignarDatosCliente = (data) => {
  const spanNombre = document.querySelector("#profile-nombre");
  const spanTipoDocumento = document.querySelector("#profile-tipoDocumento");
  const spanNumeroDocumento = document.querySelector(
    "#profile-numeroDocumento"
  );
  const spanDireccion = document.querySelector("#profile-direccion");
  const spanTelefono = document.querySelector("#profile-telefono");
  const spanCorreo = document.querySelector("#profile-correo");

  const {
    correo,
    direccion,
    nombre,
    numeroDocumento,
    telefono,
    tipoDocumento,
  } = data.info;

  spanNombre.textContent = nombre;
  spanTipoDocumento.textContent = tipoDocumento.nombre;
  spanNumeroDocumento.textContent = numeroDocumento;
  spanDireccion.textContent = direccion;
  spanTelefono.textContent = telefono;
  spanCorreo.textContent = correo;
};

export const profileClientController = async (parametros = null) => {
  const tbody = document.querySelector("#pets-client .table__body");
  const btnAtras = document.querySelector("#back-perfil");
  const btnRegisterPets = document.querySelector("#register-pets-client");
  const esModal = !location.hash.includes("clientes/perfil");

  const { id } = parametros;

  const response = await get(`usuarios/${id}`);

  if (!response.success) {
    await error(response.message);
    cerrarModalYVolverAVistaBase();
    return;
  }

  asignarDatosCliente(response.data);

  const responseMascotas = await get(`mascotas/cliente/${id}`);

  console.log(responseMascotas);

  if (responseMascotas.code == 500) {
    await error(responseMascotas.message);
    esModal ? cerrarModal("profile-client") : cerrarModalYVolverAVistaBase();
    return;
  }

  if (responseMascotas.success) {
    if (tbody) {
      responseMascotas.data.forEach(
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

  btnAtras.addEventListener("click", () => {
    esModal ? cerrarModal("profile-client") : cerrarModalYVolverAVistaBase();
  });

  btnRegisterPets.addEventListener("click", async () => {
    await cargarComponente(routes.mascotas.crear, id);
    const selectCliente = document.querySelector("#select-clients");
    const contenedor = selectCliente?.closest(".form__container-field");
    contenedor.classList.add("hidden");
  });

  const btnEditProfile = document.querySelector("#edit-client");

  btnEditProfile.addEventListener("click", async () => {
    await cargarComponente(routes.clientes.editar, { id });
    // const selectCliente = document.querySelector("#select-clients");
    // const contenedor = selectCliente?.closest(".form__container-field");
    // contenedor.classList.add("hidden");
    //
  });
};
