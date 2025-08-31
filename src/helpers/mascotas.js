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
  await renderizarSelectEspecies(selectEspecie, selectRazas);
  configurarEventosValidaciones(form);

  if (petData) {
    mapearDatosEnContenedor(petData, form);
    selectEspecie.dispatchEvent(new Event("change"));
    selectRazas.value = petData.raza_id;
  } else {
    // Colocar placeholder inicial en select de razas
    selectRazas.innerHTML =
      '<option disabled selected value="">Seleccione una especie</option>';
  }
};

export const actualizarTablas = (pet, tbody_perfilCliente, tbody_Mascotas) => {
  if (tbody_perfilCliente) {
    const { id, nombre, sexo, raza, edadFormateada } = pet;
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
    const { id, nombre, raza, cliente, ultimo_antecedente } = pet;
    const row = crearFila([
      id,
      nombre,
      raza.especie.nombre,
      raza.nombre,
      cliente.info.nombre,
      cliente.info.telefono,
      ultimo_antecedente ?? "Sin registros",
    ]);
    tbody_Mascotas.insertAdjacentElement("afterbegin", row);
  }
};
