import { agregarError, quitarError } from "../../../../helpers";
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
} from "../../../../helpers";

function validarFechaCaducidad(valorFecha) {
  if (!valorFecha) {
    return { valid: false, message: "La fecha es obligatoria" };
  }

  const hoy = new Date();
  const fechaMinima = new Date();
  fechaMinima.setMonth(hoy.getMonth() + 1); // mínimo un mes de caducidad

  const fechaIngresada = new Date(valorFecha);

  if (fechaIngresada < fechaMinima) {
    return {
      valid: false,
      message: "La fecha debe tener al menos un mes desde hoy",
    };
  }

  return { valid: true };
}

export const createProductController = async () => {
  const form = document.querySelector("#form-register-product");
  const selectTipoDocumento = document.querySelector("#tipos-documento");
  const tbody = document.querySelector("#clients .table__body");
  const esModal = !location.hash.includes("clientes/crear");

  await cargarTiposDocumento(selectTipoDocumento);

  configurarEventosValidaciones(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;
    console.log(datos);

    const inputFecha = document.querySelector("#fecha_caducidad");

    const resultado = validarFechaCaducidad(inputFecha.value);

    if (!resultado.valid) {
      agregarError(inputFecha.parentElement, resultado.message);
    } else {
      quitarError(inputFecha.parentElement);
    }
  });

  //   const response = await post("clientes", datos);

  //   console.log(response);

  //   if (!response.success) {
  //     await error(response.message);
  //     return;
  //   }

  //   await successTemporal(response.message);
  //   console.log(response);

  //   if (tbody) {
  //     const {
  //       id,
  //       info: { nombre, telefono, numeroDocumento, direccion },
  //     } = response.data;

  //     const row = crearFila([id, nombre, telefono, numeroDocumento, direccion]);
  //     tbody.insertAdjacentElement("afterbegin", row);
  //   }

  //   esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  // });

  // document.addEventListener("click", (event) => {
  //   const arrow = event.target.closest("#back-register-client");
  //   if (arrow) {
  //     esModal ? cerrarModal("create-client") : cerrarModalYVolverAVistaBase();
  //   }
  // });
};
