import { error, success, successTemporal } from "../../../helpers/alertas";
import { get, post } from "../../../helpers/api";
import {
  cargarTiposDocumento,
  llenarSelect,
} from "../../../helpers/cargarTiposDocumento";
import { crearFila } from "../../../helpers/crearFila";
import {
  cerrarModal,
  cerrarModalYVolverAVistaBase,
} from "../../../helpers/modal";
import {
  configurarEventosValidaciones,
  datos,
  validarCampo,
  validarCampos,
  validarNumero,
} from "../../../helpers/validaciones";

const calcularSemanasTotales = ({ anios = 0, meses = 0, semanas = 0 }) => {
  const semanasPorMes = 4.345;

  const totalSemanas =
    anios * 12 * semanasPorMes + meses * semanasPorMes + parseInt(semanas || 0);

  return Math.floor(totalSemanas);
};

export const createPetController = async (idDueno) => {
  const form = document.querySelector("#form-register-pet");

  const tbody = document.querySelector("#pets-client .table__body");
  const esModal = !location.hash.includes("mascotas/crear");
  const containerSelectClient = document.querySelector(
    ".form__container-field.hidden"
  )
    ? false
    : true;

  if (containerSelectClient) {
    llenarSelect({
      endpoint: "clientes",
      selector: "#select-clients",
      optionMapper: (cliente) => ({
        id: cliente.id,
        text: `${cliente.info.numeroDocumento} - ${cliente.info.nombre}`,
      }),
    });
  }

  configurarEventosValidaciones(form);

  const response = await get("especies");
  console.log(response);

  if (response.success) {
    const especiesConRazas = response.data;
    const selectEspecie = document.querySelector("#select-especies");
    const selectRazas = document.querySelector("#select-razas");

    especiesConRazas.forEach((especie) => {
      const option = document.createElement("option");
      option.value = especie.id;
      option.textContent = especie.nombre;
      selectEspecie.appendChild(option);
    });

    selectEspecie.addEventListener("change", () => {
      const idSeleccionado = parseInt(selectEspecie.value);
      const especieSeleccionada = especiesConRazas.find(
        (e) => e.id === idSeleccionado
      );

      // Limpiar el select de razas
      selectRazas.innerHTML =
        '<option disabled selected value="">Seleccione una raza</option>';

      if (especieSeleccionada) {
        especieSeleccionada.razas.forEach((raza) => {
          const option = document.createElement("option");
          option.value = raza.id;
          option.textContent = raza.nombre;
          selectRazas.appendChild(option);
        });
      }
    });

    selectRazas.addEventListener("click", () => {
      // Si el usuario intenta seleccionar una raza sin haber seleccionado especie
      if (!selectEspecie.value) {
        selectRazas.innerHTML =
          '<option disabled selected value="">Seleccione una especie</option>';
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCampos(e)) return;

    console.log(datos);

    const edad_semanas = calcularSemanasTotales(datos);
    const { nombre, sexo, id_raza, id_cliente } = datos;

    const response = await post("mascotas", {
      nombre,
      sexo,
      id_raza,
      edad_semanas,
      id_cliente: containerSelectClient ? id_cliente : idDueno,
    });

    console.log(response);

    if (!response.success) {
      await error(response.message);
    }

    await success(response.message);

    // if (tbody) {
    //   const { id, nombre, sexo, raza, edadFormateada } = response.data;

    //   const row = crearFila([
    //     id,
    //     nombre,
    //     raza.especie.nombre,
    //     raza.nombre,
    //     edadFormateada,
    //     capitalizarPrimeraLetra(sexo),
    //     ,
    //   ]);
    //   tbody.insertAdjacentElement("afterbegin", row);
    // }

    // esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();

    // console.log(response);

    // if (!response.success) {
    //   await error(response.message);
    //   return;
    // }

    // const {
    //   data: {
    //     id,
    //     info: { nombre, telefono, numeroDocumento, direccion, correo },
    //   },
    // } = response;

    // const row = crearFila([
    //   id,
    //   nombre,
    //   telefono,
    //   numeroDocumento,
    //   direccion,
    //   correo,
    // ]);

    // if (tbody) {
    //   tbody.insertAdjacentElement("afterbegin", row);
    // }

    // await successTemporal(response.message);
  });

  document.addEventListener("click", (event) => {
    const arrow = event.target.closest("#back-register-pet-client");
    if (arrow) {
      esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();
    }
  });
};
