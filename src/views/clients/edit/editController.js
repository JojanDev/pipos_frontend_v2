import {
  error,
  successTemporal,
  post,
  cargarTiposDocumento,
  crearFila,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
} from "../../../helpers";

export const createClientController = async () => {
  // Obtenemos el formulario
  const formulario = document.querySelector("#form-edit-client");

  // Obtenemos todos los inputs dentro del formulario que tengan atributo name
  const inputsConNombre = formulario.querySelectorAll("[name]");

  // Creamos un objeto donde guardamos las referencias a los inputs usando su atributo name como clave
  const campos = {};
  inputsConNombre.forEach((input) => {
    const nombreCampo = input.name;
    campos[nombreCampo] = input;
  });

  // Aquí puedes definir los datos que quieres precargar en los inputs
  const datosCliente = {
    nombre: "Carlos Pérez",
    idTipoDocumento: "1", // Asegúrate de que el value del option coincida
    numeroDocumento: "123456789",
    telefono: "3123456789",
    correo: "carlos@example.com",
    direccion: "Calle 123, Barrio Centro",
  };

  // Asignamos los valores del objeto a los inputs
  for (const campo in datosCliente) {
    if (campos[campo]) {
      campos[campo].value = datosCliente[campo];
    }
  }

  ///////////////////////////////////////////////////////////
  const form = document.querySelector("#form-register-client");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/crear");

  // await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const response = await post("clientes", datos);

    console.log(response);

    if (!response.success) {
      await error(response.message);
      return;
    }

    await successTemporal(response.message);
    console.log(response);

    if (tbody) {
      const {
        id,
        info: { nombre, telefono, numeroDocumento, direccion },
      } = response.data;

      const row = crearFila([id, nombre, telefono, numeroDocumento, direccion]);
      tbody.insertAdjacentElement("afterbegin", row);
    }

    esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-client");
    if (arrow) {
      esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
    }
  });
};
