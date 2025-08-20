import {
  error,
  success,
  get,
  post,
  llenarSelect,
  crearFila,
  capitalizarPrimeraLetra,
  cerrarModal,
  cerrarModalYVolverAVistaBase,
  configurarEventosValidaciones,
  datos,
  validarCampos,
  put,
} from "../../../helpers";
import {
  asignarDatosCliente,
  asignarDatosMascota,
} from "../profile/profileController";

function cargarDatosMascota(data) {
  // Cliente propietario
  console.log(data.cliente.id);

  document.querySelector("#select-clients").value = data.cliente.id;

  // Nombre
  document.querySelector('input[name="nombre"]').value = data.nombre;

  // Sexo
  document.querySelector('select[name="sexo"]').value = data.sexo;

  // Especie
  document.querySelector("#select-especies").value = data.raza.especie.id;

  // Forzar que se ejecute el evento 'change'
  document.querySelector("#select-especies").dispatchEvent(new Event("change"));

  // Raza
  document.querySelector("#select-razas").value = data.raza.id;

  const { anios, meses, semanas } = calcularEdadPorSemanas(data.edad_semanas);

  // Edad
  document.querySelector('input[name="anios"]').value = anios ?? "";
  document.querySelector('input[name="meses"]').value = meses ?? "";
  document.querySelector('input[name="semanas"]').value = semanas ?? "";

  // Si no tienes edad por separado en la respuesta, puedes calcularlo aquí
  // por ejemplo usando data.edadFormateada o data.edad_semanas

  // Opcional: si quieres mostrar edad a partir de edadFormateada
  // podrías hacer un pequeño parser si la API no da números separados
}

function calcularEdadPorSemanas(edadEnSemanas) {
  const semanasPorAno = 52;
  const semanasPorMes = 4;

  let anos = Math.floor(edadEnSemanas / semanasPorAno);
  let semanasRestantes = edadEnSemanas % semanasPorAno;

  let meses = Math.floor(semanasRestantes / semanasPorMes);
  let semanas = semanasRestantes % semanasPorMes;

  return {
    anios: anos === 0 ? null : anos,
    meses: meses === 0 ? null : meses,
    semanas: semanas === 0 ? null : semanas,
  };
}

const calcularSemanasTotales = ({ anios = 0, meses = 0, semanas = 0 }) => {
  const semanasPorMes = 4.345;

  const totalSemanas =
    anios * 12 * semanasPorMes + meses * semanasPorMes + parseInt(semanas || 0);

  return Math.floor(totalSemanas);
};

export const editPetController = async (parametros = null) => {
  const { id } = parametros;
  const form = document.querySelector("#form-edit-pet");

  const responseMascota = await get("mascotas/" + id);

  console.log(responseMascota);

  const tbody_perfilCliente = document.querySelector(
    "#pets-client .table__body"
  );
  const tbody_Mascotas = document.querySelector("#pets .table__body");
  const esModal = !location.hash.includes("mascotas/crear");
  const containerSelectClient = document.querySelector(
    "#container-select-clients"
  );

  if (containerSelectClient) {
    await llenarSelect({
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

  if (responseMascota.success) {
    cargarDatosMascota(responseMascota.data);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const containerSelectClient = document
      .querySelector("#container-select-clients")
      .classList.contains("hidden")
      ? false
      : true;

    if (!validarCampos(e)) return;

    const edad_semanas = calcularSemanasTotales(datos);
    const { nombre, sexo, id_raza, id_cliente } = datos;

    const response = await put("mascotas", {
      id,
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

    if (document.querySelector("#pet-profile")) {
      asignarDatosCliente(response.data);
      asignarDatosMascota(response.data);
    }

    await success(response.message);

    if (tbody_perfilCliente) {
      const { id, nombre, sexo, raza, edadFormateada } = response.data;

      const row = crearFila([
        id,
        nombre,
        raza.especie.nombre,
        raza.nombre,
        edadFormateada,
        capitalizarPrimeraLetra(sexo),
      ]);

      tbody_perfilCliente.insertAdjacentElement("afterbegin", row);
    } else if (tbody_Mascotas) {
      const { id, nombre, raza, cliente, ultimo_antecedente } = response.data;
      const row = crearFila([
        id,
        nombre,
        raza.especie.nombre,
        raza.nombre,
        cliente.info.nombre,
        cliente.info.telefono,
        ultimo_antecedente ?? "Sin registros", //PENDIENTE HACER OBTENER LA FECHA DEL ULTIMO ANTECEDENTE
      ]);

      tbody_Mascotas.insertAdjacentElement("afterbegin", row);
    }

    esModal ? cerrarModal("edit-pet") : cerrarModalYVolverAVistaBase();

    //

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
    const arrow = event.target.closest("#back-edit-pet-client");
    if (arrow) {
      esModal ? cerrarModal("edit-pet") : cerrarModalYVolverAVistaBase();
    }
  });
};
