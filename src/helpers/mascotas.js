import { convertirADiaMesAño } from "./antecedentes";
import { crearFila } from "./crearFila";
import { capitalizarPrimeraLetra, toInputDate } from "./diseño";
import { mapearDatosEnContenedor } from "./domMapper";
import { llenarSelectClientes, renderizarSelectEspecies } from "./selects";
import { configurarEventosValidaciones } from "./validaciones";

/**
 * Calcula el total de semanas a partir de años, meses y semanas.
 *
 * @param {{ anios?: number, meses?: number, semanas?: number }} partes
 * @param {number} [partes.anios=0]   - Años a convertir.
 * @param {number} [partes.meses=0]   - Meses a convertir.
 * @param {number} [partes.semanas=0] - Semanas adicionales.
 * @returns {number} Total de semanas redondeado hacia abajo.
 */
export const calcularSemanasTotales = ({
  anios = 0,
  meses = 0,
  semanas = 0,
}) => {
  const semanasPorMes = 4.345;
  const total =
    anios * 12 * semanasPorMes + meses * semanasPorMes + parseInt(semanas, 10);
  return Math.floor(total);
};

/**
 * Prepara el objeto de datos de una mascota para poblar un formulario.
 *
 * Convierte la fecha de nacimiento a formato "YYYY-MM-DD" y asigna
 * los selectores de cliente y especie según los IDs correspondientes.
 *
 * @param {Object} pet - Objeto con datos de la mascota.
 * @returns {Object} Datos extendidos listos para mapear en el formulario.
 */
export const prepararDatosMascota = (pet) => {
  const fecha_nacimiento = toInputDate(pet.fecha_nacimiento);
  console.log(fecha_nacimiento);

  return {
    ...pet,
    "select-clients": pet.usuario_id,
    fecha_nacimiento,
    "select-especies": pet.raza.especie_id,
  };
};

/**
 * Inicializa el formulario de mascota con selects y validaciones.
 *
 * Carga el listado de clientes, renderiza especies y razas,
 * configura validaciones y preselecciona datos si se proporciona petData.
 *
 * @param {HTMLFormElement} form                    - Formulario a inicializar.
 * @param {HTMLSelectElement} selectEspecie         - Select de especies.
 * @param {HTMLSelectElement} selectRazas           - Select de razas.
 * @param {HTMLElement|null} containerSelectClient  - Contenedor del select de clientes.
 * @param {Object|null} petData                     - Datos de mascota para edición.
 * @returns {Promise<void>}
 */
export const inicializarFormularioMascota = async (
  form,
  selectEspecie,
  selectRazas,
  containerSelectClient,
  petData = null
) => {
  if (containerSelectClient) {
    await llenarSelectClientes();
  }

  const actualizarRazas = await renderizarSelectEspecies(
    selectEspecie,
    selectRazas
  );
  configurarEventosValidaciones(form);

  if (petData) {
    mapearDatosEnContenedor(petData, form);
    selectEspecie.value = petData.raza.especie_id;
    await actualizarRazas();
    selectRazas.value = petData.raza.id;
  } else {
    selectRazas.innerHTML =
      '<option disabled selected value="">Seleccione una especie</option>';
  }
};

/**
 * Inserta una nueva fila en la tabla de perfil o en la tabla de mascotas.
 *
 * Si existe tbody_perfilCliente, agrega una fila con datos básicos;
 * en caso contrario, agrega a tbody_Mascotas con información extendida.
 *
 * @param {Object} pet                       - Datos de la mascota.
 * @param {HTMLElement|null} tbody_perfilCliente - Cuerpo de tabla de perfil de cliente.
 * @param {HTMLElement|null} tbody_Mascotas      - Cuerpo de tabla de mascotas.
 */
export const actualizarTablas = (pet, tbody_perfilCliente, tbody_Mascotas) => {
  if (tbody_perfilCliente) {
    const { id, nombre, raza, especie, sexo, fecha_nacimiento } = pet;
    const row = crearFila([
      id,
      nombre,
      especie,
      raza,
      convertirADiaMesAño(fecha_nacimiento),
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
