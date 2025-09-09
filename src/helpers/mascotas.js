import { crearFila } from "./crearFila";
import { capitalizarPrimeraLetra } from "./diseño";
import { mapearDatosEnContenedor } from "./domMapper";
import { llenarSelectClientes, renderizarSelectEspecies } from "./selects";
import { configurarEventosValidaciones } from "./validaciones";

export const calcularEdadPorSemanas = (edadEnSemanas) => {
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
};

export const calcularSemanasTotales = ({
  anios = 0,
  meses = 0,
  semanas = 0,
}) => {
  const semanasPorMes = 4.345;

  const totalSemanas =
    anios * 12 * semanasPorMes + meses * semanasPorMes + parseInt(semanas || 0);

  return Math.floor(totalSemanas);
};

export const prepararDatosMascota = (pet) => {
  const { anios, meses, semanas } = calcularEdadPorSemanas(pet.edad_semanas);
  return {
    ...pet,
    "select-clients": pet.usuario_id,
    anios,
    meses,
    semanas,
    "select-especies": pet.raza.especie_id,
  };
};

export const inicializarFormularioMascota = async (
  form,
  selectEspecie,
  selectRazas,
  containerSelectClient,
  petData = null
) => {
  if (containerSelectClient) await llenarSelectClientes();

  // 1. renderizar select de especies devuelve la función actualizarRazas
  const actualizarRazas = await renderizarSelectEspecies(
    selectEspecie,
    selectRazas
  );
  configurarEventosValidaciones(form);

  if (petData) {
    mapearDatosEnContenedor(petData, form);

    // 2. preseleccionar especie
    selectEspecie.value = petData.raza.especie_id;

    // 3. esperar a que razas se carguen
    await actualizarRazas();

    // 4. asignar raza
    selectRazas.value = petData.raza.id;
  } else {
    selectRazas.innerHTML =
      '<option disabled selected value="">Seleccione una especie</option>';
  }
};

export const actualizarTablas = (pet, tbody_perfilCliente, tbody_Mascotas) => {
  if (tbody_perfilCliente) {
    const { id, nombre, raza, especie, sexo, edad_semanas } = pet;
    const row = crearFila([
      id,
      nombre,
      especie,
      raza,
      edad_semanas ? convertirEdadCorta(edad_semanas) : "Desconocida",
      capitalizarPrimeraLetra(sexo),
    ]);
    tbody_perfilCliente.insertAdjacentElement("afterbegin", row);
  } else if (tbody_Mascotas) {
    const { id, nombre, raza, especie, cliente, telefono, ultimo_antecedente } =
      pet;
    const row = crearFila([
      id,
      nombre,
      raza,
      especie,
      cliente,
      telefono,
      ultimo_antecedente ?? "Sin registros",
    ]);
    tbody_Mascotas.insertAdjacentElement("afterbegin", row);
  }
};

export const convertirEdadCorta = (semanasTotales) => {
  const semanasPorAno = 52;
  const semanasPorMes = 4;

  const anos = Math.floor(semanasTotales / semanasPorAno);
  const restoDespuesAnos = semanasTotales % semanasPorAno;

  const meses = Math.floor(restoDespuesAnos / semanasPorMes);
  const semanas = restoDespuesAnos % semanasPorMes;

  const partes = [];

  if (anos > 0) partes.push(`${anos} año${anos > 1 ? "s" : ""}`);
  if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);

  if (semanas > 0) {
    // Si hay años y meses al mismo tiempo
    if (anos > 0 && meses > 0) {
      partes.push(`${semanas} sem`);
    } else {
      partes.push(`${semanas} semana${semanas > 1 ? "s" : ""}`);
    }
  }

  return partes.join(" ");
};
