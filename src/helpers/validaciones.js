// Teclas espeiales
const teclasEspeciales = [
  "Backspace",
  "Tab",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "Delete",
  "Home",
  "End",
]; // Teclas especiales que se permiten

// Validación para los campos de texto con límite de caracteres
export const validarLimite = (event, limite) => {
  const key = event.key;
  if (!teclasEspeciales.includes(key) && event.target.value.length >= limite) {
    event.preventDefault(); // Evitamos la acción de la tecla si el campo supera el límite
    return { valid: false, message: `Se permiten maximo ${limite} caracteres` };
  }

  return { valid: true };
};

// Validación para los campos de texto
export const validarTexto = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[\D]*$/i; // Expresión regular para letras y caracteres especiales

  // Validamos si la tecla no es una letra
  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault(); // Evitamos la acción de la tecla
    return { valid: false, message: "Solo se permiten letras" };
  }
  return { valid: true };
};

// Validación para los campos de texto
export const validarAlfanumericos = (event) => {
  const regex = /[^\w_.]/g;
  const limpio = event.target.value.replace(regex, "");
  // const key = event.key || event.target.value.slice(-1);
  // console.log("Tecla presionada:", key);
  // console.log("Regex:", regex.test(key));
  // console.log("Es especial:", teclasEspeciales.includes(key));

  // if (!regex.test(key) && !teclasEspeciales.includes(key)) {
  //   console.log("NO válido, se bloquea");
  //   event.preventDefault();
  //   return { valid: false, message: "Solo se permiten alfanumericos" };
  // }

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo se permiten alfanumericos" };
  }

  console.log("Sí válido");
  return { valid: true };
};

// Validación para los campos de número
export const validarNumero = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[\d]*$/; // Expresión regular para números

  // Validamos si la tecla no es un número
  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault(); // Evitamos la acción de la tecla
    return { valid: false, message: "Solo se permiten numeros" };
  }
  return { valid: true };
};

// Validación para la contraseña
export const validarContrasena = (contrasena) => {
  let regexContra = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/; // Expresión regular para validar la contraseña
  // Validamos si la contraseña es válida
  if (contrasena.value.trim() != "" && !regexContra.test(contrasena.value)) {
    let error = "";

    if (contrasena.value.length < 8)
      // Validamos si la contraseña tiene al menos 8 caracteres
      error = "Al menos 8 caracteres.";

    if (!/\W/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos un carácter especial
      error = "Un carácter especial.";

    if (!/\d/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos un número
      error = "Un número.";

    if (!/[A-Z]/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos una mayúscula
      error = "Una mayúscula.";

    if (!/[a-z]/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos una mayúscula
      error = "Una minuscula.";

    if (!/[a-zA-Z]/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos una letra
      error = "Una letra.";

    return { valid: false, message: "Requisitos: " + error };
  }
  return { valid: true };
};

// Validación para el correo electrónico
export const validarCorreo = (correo) => {
  let regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para validar el correo electrónico
  // Validamos si el correo es válido
  if (correo.value.trim() != "" && !regexCorreo.test(correo.value)) {
    return { valid: false, message: "El correo electrónico no es válido." };
  }
  return { valid: true };
};

// --------------------------------------------------------
// Funciones para agregar y quitar errores

// Agrega un borde rojo y un mensaje de advertencia al campo
const agregarError = (campo, mensaje = "El campo es obligatorio.") => {
  campo.classList.add("error");
  campo.style.setProperty("--error-content", `"${mensaje}"`);
};

// Quita el borde rojo y el mensaje de advertencia del campo
const quitarError = (campo) => {
  campo.classList.remove("error");
};

// --------------------------------------------------------

// Validación para los campos de texto y las listas desplegables
// Retorna true o false dependiendo de si el campo es válido o no

//=======================================================

export const validarCampo = (event) => {
  const campo = event.target; // El input o select actual
  const tipo = campo.dataset.validate; // Cadena de validadores, como "alfanumerico, limite:10"
  const eventoActual = event.type; // Tipo de evento actual (keydown, input, blur)

  // Validación de campo vacío
  const vacio =
    (campo.tagName === "INPUT" && campo.value.trim() === "") ||
    (campo.tagName === "SELECT" && campo.selectedIndex === 0);

  if (vacio) {
    agregarError(campo.parentElement);
    return false;
  }

  if (tipo) {
    // Separa los validadores por coma y elimina espacios
    const tipos = tipo.split(",").map((t) => t.trim());

    for (let t of tipos) {
      // Permite validadores con parámetros: por ejemplo "limite:10"
      const [nombre, param] = t.split(":").map((p) => p.trim());

      // Solo ejecuta el validador si:
      // 1. Existe en el objeto validadoresInput
      // 2. Está asignado para ejecutarse en el tipo de evento actual
      if (validadoresInput[nombre]) {
        // Ejecuta el validador, pasándole el parámetro si existe
        const resultado = param
          ? validadoresInput[nombre](event, param)
          : validadoresInput[nombre](event);

        // Si el resultado indica error, se muestra y se detiene la validación
        if (!resultado.valid) {
          agregarError(campo.parentElement, resultado.message);
          return false;
        }
      }
    }
  }

  // Si pasó todas las validaciones, se limpia el mensaje de error
  quitarError(campo.parentElement);
  return true;
};

export const configurarEventosValidaciones = (formulario) => {
  const campos = obtenerCamposValidables(formulario);

  console.log("Registrando validaciones a:", campos);

  campos.forEach((campo) => {
    campo.addEventListener("blur", validarCampo);
    campo.addEventListener("input", validarCampo);
  });
};

// --------------------------------------------------------
// Función para validar todos los campos del formulario

export const datos = {}; // Objeto para almacenar los datos del formulario
//Objeto con las funciones validadoras
const validadoresInput = {
  texto: validarTexto,
  numero: validarNumero,
  alfanumerico: validarAlfanumericos,
  contrasena: (e) => validarContrasena(e.target),
  correo: (e) => validarCorreo(e.target),
  limite: validarLimite,
  // Puedes seguir agregando más tipos según crezcas
};

const obtenerCamposValidables = (formulario) => {
  return [...formulario].filter(
    (elemento) =>
      elemento.hasAttribute("required") &&
      (elemento.tagName === "INPUT" || elemento.tagName === "SELECT")
  );
};

export const validarCampos = (event) => {
  let valido = true;
  const campos = obtenerCamposValidables(event.target);

  campos.forEach((campo) => {
    if (!validarCampo({ target: campo })) valido = false;
    datos[campo.getAttribute("name")] = campo.value;
  });

  return valido;
};

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
