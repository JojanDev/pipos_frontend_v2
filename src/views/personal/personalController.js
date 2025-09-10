// Helpers
import {
  get,
  crearFila,
  capitalizarPrimeraLetra,
  error,
  DOMSelector,
} from "../../helpers";

// Permissions
import hasPermission from "../../helpers/hasPermission";

/**
 * Carga el listado de empleados desde la API y construye la tabla de personal.
 *
 * Para cada usuario:
 *   1. Obtiene sus roles mediante roles-usuarios/usuario/:id.
 *   2. Si falla la petición de roles, asigna ["No aplica"].
 *   3. Si tiene roles, consulta nombres de cada rol vía roles/:id.
 *   4. Compone un arreglo con [id, roles, nombre completo, teléfono, documento, dirección].
 *   5. Genera la fila con crearFila() y marca alerta si su credencial está inactiva.
 *
 * @returns {Promise<void>}
 *   No retorna valor; actualiza el DOM en "#personal .table__body".
 *
 */
const cargarTablaEmpleados = async () => {
  // Solicitamos todos los empleados
  const usuarios = await get("usuarios/empleados");
  console.log(usuarios);

  // Si la petición falla, mostramos error y salimos
  if (!usuarios.success) {
    await error(usuarios.message);
    return;
  }

  // Seleccionamos y limpiamos el cuerpo de la tabla de personal
  const tbody = DOMSelector("#personal .table__body");
  tbody.innerHTML = "";

  // Construimos un arreglo de datos para cada empleado
  const personalInfo = await Promise.all(
    usuarios.data.map(async (usuario) => {
      // Obtenemos roles asociados al usuario
      const rolesUsuario = await get(`roles-usuarios/usuario/${usuario.id}`);

      let nombreRoles;
      if (!rolesUsuario.success) {
        // Si no hay roles o la petición falla, usamos "No aplica"
        nombreRoles = ["No aplica"];
      } else {
        // Mapeamos cada rol a su nombre capitalizado
        nombreRoles = await Promise.all(
          rolesUsuario.data.map(async (roleUsuario) => {
            const { data: rol } = await get(`roles/${roleUsuario.rol_id}`);
            return capitalizarPrimeraLetra(rol.nombre);
          })
        );
      }

      // Devolvemos los campos en el orden que espera crearFila()
      return [
        usuario.id,
        nombreRoles.join(", ") ?? "No aplica",
        `${usuario.nombre} ${usuario.apellido}`,
        usuario.telefono,
        usuario.numero_documento,
        usuario.direccion,
      ];
    })
  );

  // Para cada conjunto de datos, creamos la fila y comprobamos credenciales
  await Promise.all(
    personalInfo.map(async (personal) => {
      const row = crearFila(personal);

      // Verificamos si la credencial del usuario está activa
      const credencialResp = await get(`credenciales/${personal[0]}`);
      if (credencialResp.success && !credencialResp.data.activo) {
        // Marcamos fila con alerta si la credencial está inactiva
        row.classList.add("fila-alerta");
      }

      // Añadimos la fila al tbody
      tbody.append(row);
    })
  );
};

/**
 * Controlador principal para la vista de personal.
 * Se encarga de cargar datos, filtrar acciones por permisos y gestionar navegación al perfil.
 *
 * @returns {Promise<void>}
 *   No retorna valor; instala listeners y manipula el DOM.
 *
 */
export const personalController = async () => {
  // Cargamos inicialmente la tabla de empleados
  await cargarTablaEmpleados();

  // Referencias a la sección de personal y su contenedor de acciones
  const tablaPersonal = DOMSelector("#personal");
  const contenedorVista = DOMSelector("#vista-usuarios");

  // Filtramos botones y enlaces según permisos del usuario
  Array.from(contenedorVista.querySelectorAll("[data-permiso]")).forEach(
    (accion) => {
      const permisosRequeridos = accion.dataset.permiso.split(",");
      if (!hasPermission(permisosRequeridos)) {
        accion.remove();
      }
    }
  );

  // Al hacer clic en una fila, navegamos al perfil de ese empleado
  tablaPersonal.addEventListener("click", (event) => {
    const fila = event.target.closest("tr[data-id]");
    if (!fila) return;

    const idEmpleado = fila.getAttribute("data-id");
    // Aseguramos slash antes de agregar la ruta
    const baseHash = location.hash.endsWith("/")
      ? location.hash
      : `${location.hash}/`;
    location.hash = `${baseHash}perfil/id=${idEmpleado}`;
  });
};
