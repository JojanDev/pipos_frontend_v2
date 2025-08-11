// import {
//   error,
//   success,
//   get,
//   post,
//   llenarSelect,
//   crearFila,
//   capitalizarPrimeraLetra,
//   cerrarModal,
//   cerrarModalYVolverAVistaBase,
//   configurarEventosValidaciones,
//   datos,
//   validarCampos,
// } from "../../../helpers";

// function cargarDatosMascota(data) {
//   // Cliente propietario
//   document.querySelector("#select-clients").value = data.cliente.id;

//   // Nombre
//   document.querySelector('input[name="nombre"]').value = data.nombre;

//   // Sexo
//   document.querySelector('select[name="sexo"]').value = data.sexo;

//   // Especie
//   document.querySelector("#select-especies").value = data.raza.especie.id;

//   // Raza
//   document.querySelector("#select-razas").value = data.raza.id;

//   // Edad
//   document.querySelector('input[name="anios"]').value = data.edad_anios ?? ""; // si tu API lo manda
//   document.querySelector('input[name="meses"]').value = data.edad_meses ?? "";
//   document.querySelector('input[name="semanas"]').value =
//     data.edad_semanas ?? "";

//   // Si no tienes edad por separado en la respuesta, puedes calcularlo aquí
//   // por ejemplo usando data.edadFormateada o data.edad_semanas

//   // Opcional: si quieres mostrar edad a partir de edadFormateada
//   // podrías hacer un pequeño parser si la API no da números separados
// }

// const calcularSemanasTotales = ({ anios = 0, meses = 0, semanas = 0 }) => {
//   const semanasPorMes = 4.345;

//   const totalSemanas =
//     anios * 12 * semanasPorMes + meses * semanasPorMes + parseInt(semanas || 0);

//   return Math.floor(totalSemanas);
// };

// export const editPetController = async (parametros = null) => {
//   const { id } = parametros;
//   const form = document.querySelector("#form-edit-pet");

//   const responseMascota = await get("mascotas/" + id);

//   console.log(responseMascota);

//   const tbody_perfilCliente = document.querySelector(
//     "#pets-client .table__body"
//   );
//   const tbody_Mascotas = document.querySelector("#pets .table__body");
//   const esModal = !location.hash.includes("mascotas/crear");
//   const containerSelectClient = document.querySelector(
//     "#container-select-clients"
//   );

//   if (containerSelectClient) {
//     llenarSelect({
//       endpoint: "clientes",
//       selector: "#select-clients",
//       optionMapper: (cliente) => ({
//         id: cliente.id,
//         text: `${cliente.info.numeroDocumento} - ${cliente.info.nombre}`,
//       }),
//     });
//   }

//   configurarEventosValidaciones(form);

//   const response = await get("especies");
//   console.log(response);

//   if (response.success) {
//     const especiesConRazas = response.data;
//     const selectEspecie = document.querySelector("#select-especies");
//     const selectRazas = document.querySelector("#select-razas");

//     especiesConRazas.forEach((especie) => {
//       const option = document.createElement("option");
//       option.value = especie.id;
//       option.textContent = especie.nombre;
//       selectEspecie.appendChild(option);
//     });

//     selectEspecie.addEventListener("change", () => {
//       const idSeleccionado = parseInt(selectEspecie.value);
//       const especieSeleccionada = especiesConRazas.find(
//         (e) => e.id === idSeleccionado
//       );

//       // Limpiar el select de razas
//       selectRazas.innerHTML =
//         '<option disabled selected value="">Seleccione una raza</option>';

//       if (especieSeleccionada) {
//         especieSeleccionada.razas.forEach((raza) => {
//           const option = document.createElement("option");
//           option.value = raza.id;
//           option.textContent = raza.nombre;
//           selectRazas.appendChild(option);
//         });
//       }
//     });

//     selectRazas.addEventListener("click", () => {
//       // Si el usuario intenta seleccionar una raza sin haber seleccionado especie
//       if (!selectEspecie.value) {
//         selectRazas.innerHTML =
//           '<option disabled selected value="">Seleccione una especie</option>';
//       }
//     });
//   }

//   if (responseMascota.success) {
//     cargarDatosMascota(responseMascota.data);
//   }

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const containerSelectClient = document
//       .querySelector("#container-select-clients")
//       .classList.contains("hidden")
//       ? false
//       : true;

//     if (!validarCampos(e)) return;

//     console.log(datos);

//     const edad_semanas = calcularSemanasTotales(datos);
//     const { nombre, sexo, id_raza, id_cliente } = datos;

//     console.log(containerSelectClient);
//     console.log(id_cliente);
//     console.log(idDueno);

//     const response = await post("mascotas", {
//       nombre,
//       sexo,
//       id_raza,
//       edad_semanas,
//       id_cliente: containerSelectClient ? id_cliente : idDueno,
//     });

//     console.log(response);

//     if (!response.success) {
//       await error(response.message);
//     }

//     await success(response.message);

//     if (tbody_perfilCliente) {
//       const { id, nombre, sexo, raza, edadFormateada } = response.data;

//       const row = crearFila([
//         id,
//         nombre,
//         raza.especie.nombre,
//         raza.nombre,
//         edadFormateada,
//         capitalizarPrimeraLetra(sexo),
//       ]);

//       tbody_perfilCliente.insertAdjacentElement("afterbegin", row);
//     } else if (tbody_Mascotas) {
//       console.log(tbody_Mascotas);
//       console.log(response.data);

//       const { id, nombre, raza, cliente, ultimo_antecedente } = response.data;
//       const row = crearFila([
//         id,
//         nombre,
//         raza.especie.nombre,
//         raza.nombre,
//         cliente.info.nombre,
//         cliente.info.telefono,
//         ultimo_antecedente ?? "Sin registros", //PENDIENTE HACER OBTENER LA FECHA DEL ULTIMO ANTECEDENTE
//       ]);
//       console.log(row);

//       tbody_Mascotas.insertAdjacentElement("afterbegin", row);
//     }

//     esModal ? cerrarModal("create-pet") : cerrarModalYVolverAVistaBase();

//     // console.log(response);

//     // if (!response.success) {
//     //   await error(response.message);
//     //   return;
//     // }

//     // const {
//     //   data: {
//     //     id,
//     //     info: { nombre, telefono, numeroDocumento, direccion, correo },
//     //   },
//     // } = response;

//     // const row = crearFila([
//     //   id,
//     //   nombre,
//     //   telefono,
//     //   numeroDocumento,
//     //   direccion,
//     //   correo,
//     // ]);

//     // if (tbody) {
//     //   tbody.insertAdjacentElement("afterbegin", row);
//     // }

//     // await successTemporal(response.message);
//   });

//   document.addEventListener("click", (event) => {
//     const arrow = event.target.closest("#back-edit-pet-client");
//     if (arrow) {
//       esModal ? cerrarModal("edit-pet") : cerrarModalYVolverAVistaBase();
//     }
//   });
// };
