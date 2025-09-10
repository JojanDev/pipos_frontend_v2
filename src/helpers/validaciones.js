/**
 * Valida que un campo de texto no exceda un límite de caracteres.
 *
 * @param {Event} event   - Evento del input donde se introduce el texto.
 * @param {number} limite - Número máximo de caracteres permitidos.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si supera el límite; true en caso contrario.
 *   message: texto de error cuando valid es false.
 */
export const validarLimite = (event, limite) => {
  // Obtener el valor actual del input
  const valor = event.target.value;

  // Si excede el límite, recortar y devolver mensaje de error
  if (valor.length > limite) {
    event.target.value = valor.slice(0, limite);
    return { valid: false, message: `Máx. ${limite} caracteres` };
  }

  // Dentro del límite
  return { valid: true };
};

/**
 * Valida que el valor de un campo solo contenga letras y números.
 *
 * Elimina cualquier carácter distinto de [A-Za-z0-9].
 *
 * @param {Event} event - Evento del input donde se introduce el lote.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si se encontraron caracteres inválidos; true en caso contrario.
 *   message: texto de error cuando valid es false.
 */
export const validarLote = (event) => {
  // Regex para detectar caracteres no alfanuméricos
  const regex = /[^A-Za-z0-9]/g;
  // Valor limpio tras eliminar caracteres inválidos
  const limpio = event.target.value.replace(regex, "");

  // Si hubo diferencias, ajustar el campo y devolver error
  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo letras y numeros" };
  }

  return { valid: true };
};

/**
 * Valida una fecha ingresada en un campo de tipo date.
 *
 * - No acepta fechas inválidas o futuras.
 * - No acepta fechas con más de 20 años de antigüedad.
 *
 * @param {Event} event - Evento del input date.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si la fecha no cumple condiciones; true en caso contrario.
 *   message: texto de error cuando valid es false.
 */
export const validarFecha = (event) => {
  // Obtener la cadena y convertir a Date
  const fechaStr = event.target.value;
  const fechaIngresada = new Date(fechaStr);
  const hoy = new Date();

  // Calcular fecha límite: 20 años atrás desde hoy
  const hace20Anios = new Date();
  hace20Anios.setFullYear(hoy.getFullYear() - 20);

  // Fecha inválida (parse fallo)
  if (isNaN(fechaIngresada)) {
    event.target.value = "";
    return { valid: false, message: "Fecha inválida" };
  }

  // Fecha futura no permitida
  if (fechaIngresada > hoy) {
    event.target.value = "";
    return { valid: false, message: "La fecha no puede ser mayor a hoy" };
  }

  // Fecha con más de 20 años de antigüedad no permitida
  if (fechaIngresada < hace20Anios) {
    event.target.value = "";
    return {
      valid: false,
      message: "La fecha no puede tener más de 20 años",
    };
  }

  return { valid: true };
};

/**
 * Valida que un campo de texto solo contenga letras (incluye acentos y ñ).
 *
 * Elimina cualquier carácter que no sea letra o espacio.
 *
 * @param {Event} event - Evento del input donde se introduce texto.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si se encontraron caracteres inválidos; true en caso contrario.
 *   message: texto de error cuando valid es false.
 */
export const validarTexto = (event) => {
  // Regex para detectar caracteres distintos de letras y espacios
  const regex = /[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]/g;
  const limpio = event.target.value.replace(regex, "");

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo letras" };
  }

  return { valid: true };
};

/**
 * Valida que un campo de texto solo contenga letras, números y espacios.
 *
 * Incluye caracteres alfanuméricos Unicode.
 *
 * @param {Event} event - Evento del input donde se introduce texto.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si se encontraron caracteres inválidos; true en caso contrario.
 *   message: texto de error cuando valid es false.
 */
export const validarTextoYNumeros = (event) => {
  // Regex para detectar caracteres distintos de letras, números y espacios
  const regex = /[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\w ]/g;
  const limpio = event.target.value.replace(regex, "");

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo letras y numeros" };
  }

  return { valid: true };
};

/**
 * Valida que un campo solo contenga caracteres alfanuméricos, guion bajo y punto.
 *
 * @param {Event} event - Evento del input a validar.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si hay caracteres inválidos; true en caso contrario.
 *   message: texto de error cuando valid es false.
 */
export const validarAlfanumericos = (event) => {
  // Regex para detectar todo menos letras, números, '_' y '.'
  const regex = /[^\w_.]/g;
  const limpio = event.target.value.replace(regex, "");

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo alfanumérico" };
  }

  return { valid: true };
};

/**
 * Valida que un campo solo contenga dígitos (0-9).
 *
 * @param {Event} event - Evento del input donde se introduce el número.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si se encontraron caracteres no numéricos; true en caso contrario.
 *   message: texto de error cuando valid es false.
 */
export const validarNumero = (event) => {
  // Regex para detectar todo menos dígitos
  const regex = /[^\d]/g;
  const limpio = event.target.value.replace(regex, "");

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo números" };
  }

  return { valid: true };
};

/**
 * Valida una contraseña según criterios de seguridad:
 * al menos 8 caracteres, una mayúscula, una minúscula,
 * un número y un carácter especial.
 *
 * @param {HTMLInputElement} contrasena - Campo input de contraseña.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si no cumple requisitos; true si es válida.
 *   message: texto con el último requisito no satisfecho.
 */
export const validarContrasena = (contrasena) => {
  const regexContra = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

  if (contrasena.value.trim() !== "" && !regexContra.test(contrasena.value)) {
    let error = "";

    if (contrasena.value.length < 8) {
      error = "Al menos 8 caracteres.";
    }
    if (!/\W/.test(contrasena.value)) {
      error = "Un carácter especial.";
    }
    if (!/\d/.test(contrasena.value)) {
      error = "Un número.";
    }
    if (!/[A-Z]/.test(contrasena.value)) {
      error = "Una mayúscula.";
    }
    if (!/[a-z]/.test(contrasena.value)) {
      error = "Una minúscula.";
    }
    if (!/[a-zA-Z]/.test(contrasena.value)) {
      error = "Una letra.";
    }

    return { valid: false, message: "Requisitos: " + error };
  }

  return { valid: true };
};

/**
 * Valida el formato de un correo electrónico.
 *
 * @param {HTMLInputElement} correo - Campo input de correo.
 * @returns {{ valid: boolean, message?: string }}
 *   valid: false si el formato es incorrecto; true en caso correcto.
 *   message: texto de error cuando valid es false.
 */
export const validarCorreo = (correo) => {
  const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (correo.value.trim() !== "" && !regexCorreo.test(correo.value)) {
    return { valid: false, message: "El correo electrónico no es válido." };
  }

  return { valid: true };
};

/**
 * Marca un campo con estilo de error y muestra un mensaje.
 *
 * @param {HTMLElement} campo - Elemento que contiene el input a marcar.
 * @param {string} [mensaje="El campo es obligatorio."] - Texto del error.
 * @returns {void}
 */
export const agregarError = (campo, mensaje = "El campo es obligatorio.") => {
  campo.classList.add("error");
  campo.style.setProperty("--error-content", `"${mensaje}"`);
};

/**
 * Elimina la marca de error y el mensaje de advertencia de un campo.
 *
 * @param {HTMLElement} campo - Elemento que contiene el input a limpiar.
 * @returns {void}
 */
export const quitarError = (campo) => {
  campo.classList.remove("error");
};

/**
 * Valida un campo de formulario según su atributo data-validate y required.
 *
 * - Si es requerido y está vacío, muestra error obligatorio.
 * - Si tiene validadores específicos, aplica cada uno.
 * - Al pasar validaciones, limpia cualquier error previo.
 *
 * @param {Event} event - Evento de input o change que invoca la validación.
 * @returns {boolean} True si el campo es válido; false en caso contrario.
 */
export const validarCampo = (event) => {
  const campo = event.target;
  const tipo = campo.dataset.validate;
  const esRequerido = campo.hasAttribute("required");
  const valor = campo.value.trim();
  const vacioInput =
    (campo.tagName === "INPUT" || campo.tagName === "TEXTAREA") && valor === "";
  const vacioSelect = campo.tagName === "SELECT" && campo.selectedIndex === 0;

  // Requerido y vacío
  if (esRequerido && (vacioInput || vacioSelect)) {
    agregarError(campo.parentElement, "El campo es obligatorio.");
    return false;
  }

  // No requerido y vacío
  if (!esRequerido && valor === "") {
    quitarError(campo.parentElement);
    return true;
  }

  // Validaciones específicas
  if (tipo) {
    const tipos = tipo.split(",").map((t) => t.trim());

    for (let t of tipos) {
      const [nombre, param] = t.split(":").map((p) => p.trim());
      if (validadoresInput[nombre]) {
        const resultado = param
          ? validadoresInput[nombre](event, param)
          : validadoresInput[nombre](event);
        if (!resultado.valid) {
          agregarError(campo.parentElement, resultado.message);
          return false;
        }
      }
    }
  }

  // Limpia errores si todo pasó
  quitarError(campo.parentElement);
  return true;
};

/**
 * Registra eventos de validación en cada campo requerido u opcional de un formulario.
 *
 * - Campos requeridos (attribute `required`) y campos con `data-validate` reciben
 *   listeners de `blur` e `input` para disparar `validarCampo`.
 *
 * @param {HTMLFormElement|HTMLFieldSetElement} formulario
 *   Formulario o contenedor de campos a los que aplicar validaciones.
 */
export const configurarEventosValidaciones = (formulario) => {
  const requeridos = obtenerCamposValidables(formulario);
  const opcionales = obtenerCamposOpcionales(formulario);
  const campos = [...requeridos, ...opcionales];

  console.log("Registrando validaciones a:", campos);

  campos.forEach((campo) => {
    campo.addEventListener("blur", validarCampo);
    campo.addEventListener("input", validarCampo);
  });
};

// --------------------------------------------------------
// Mapping de tipos de validación a funciones específicas
const validadoresInput = {
  texto: validarTexto,
  numero: validarNumero,
  alfanumerico: validarAlfanumericos,
  contrasena: (e) => validarContrasena(e.target),
  correo: (e) => validarCorreo(e.target),
  limite: validarLimite,
  textoNumeros: validarTextoYNumeros,
  lote: validarLote,
  fecha_nacimiento: validarFecha,
  // Agrega más validadores según crezcan los requisitos
};

/**
 * Obtiene campos no requeridos pero con validaciones definidas en `data-validate`.
 *
 * Excluye aquellos cuyo contenedor padre tenga la clase `hidden`.
 *
 * @param {HTMLFormElement|HTMLFieldSetElement} formulario
 * @returns {HTMLElement[]}
 */
const obtenerCamposOpcionales = (formulario) => {
  return [...formulario].filter(
    (elemento) =>
      !elemento.hasAttribute("required") &&
      !elemento.parentElement.classList.contains("hidden") &&
      (elemento.tagName === "INPUT" || elemento.tagName === "SELECT") &&
      elemento.dataset.validate
  );
};

/**
 * Obtiene campos requeridos (`required`) que puedan validarse.
 *
 * Excluye aquellos cuyo contenedor padre tenga la clase `hidden`.
 *
 * @param {HTMLFormElement|HTMLFieldSetElement} formulario
 * @returns {HTMLElement[]}
 */
const obtenerCamposValidables = (formulario) => {
  return [...formulario].filter(
    (elemento) =>
      elemento.hasAttribute("required") &&
      !elemento.parentElement.classList.contains("hidden") &&
      (elemento.tagName === "INPUT" ||
        elemento.tagName === "SELECT" ||
        elemento.tagName === "TEXTAREA")
  );
};

/**
 * Valida todos los campos de un formulario disparado por submit o evento.
 *
 * - Recopila valores en `datos`, convirtiendo cadenas de dígitos a números.
 * - Aplica validación obligatoria y específica (`data-validate`).
 *
 * @param {Event} event - Evento de submit, click u otro que contenga `target` como formulario.
 * @returns {boolean} True si todos los campos pasan validación; false si alguno falla.
 */
export const validarCampos = (event) => {
  let valido = true;
  datos = {}; // Reiniciar objeto global de datos

  const formulario = event.target;
  const requeridos = obtenerCamposValidables(formulario);
  const opcionales = obtenerCamposOpcionales(formulario);
  const campos = [...requeridos, ...opcionales];

  campos.forEach((campo) => {
    // Validar campos obligatorios
    if (campo.hasAttribute("required")) {
      if (!validarCampo({ target: campo })) valido = false;
    } else {
      // Validar opcionales solo si tienen valor
      if (campo.value.trim() !== "" && !validarCampo({ target: campo })) {
        valido = false;
      }
    }

    // Guardar valor (primitivo) en datos
    const raw = campo.value.trim();
    datos[campo.getAttribute("name")] = /^\d+$/.test(raw)
      ? parseInt(raw, 10)
      : raw;
  });

  return valido;
};

/**
 * Escucha clics en el body para alternar visibilidad de contraseña.
 *
 * Detecta clic en el icono .eye-icon adyacente a un input#contrasena y
 * cambia entre type="password" y type="text".
 */
document.body.addEventListener("click", (e) => {
  if (e.target.matches(".form__input#contrasena + .eye-icon")) {
    const icono = e.target;
    const input = icono.previousElementSibling;
    if (!input || input.tagName !== "INPUT") return;

    if (input.type === "password") {
      input.type = "text";
      icono.classList.replace("ri-eye-line", "ri-eye-close-line");
    } else {
      input.type = "password";
      icono.classList.replace("ri-eye-close-line", "ri-eye-line");
    }
  }
});
