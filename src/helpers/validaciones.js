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
  if (!teclasEspeciales.includes(key) && event.target.value.length >= limite)
    event.preventDefault(); // Evitamos la acción de la tecla si el campo supera el límite

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
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[a-zA-Z0-9.-_]$/; // Expresión regular para letras y caracteres especiales

  console.log(key);

  // Validamos si la tecla no es una letra
  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault(); // Evitamos la acción de la tecla
    return { valid: false, message: "Solo se permiten alfanumericos" };
  }
  return { valid: true };
};

// Validación para los campos de número
export const validarNumero = (event) => {
  log;
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
  let regexContra = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // Expresión regular para validar la contraseña
  // Validamos si la contraseña es válida
  if (contrasena.value.trim() != "" && !regexContra.test(contrasena.value)) {
    let error = "";

    /*
    if (!/[A-Z]/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos una mayúscula
      error = "Una mayúscula.";
    */
    if (contrasena.value.length < 8)
      // Validamos si la contraseña tiene al menos 8 caracteres
      error = "Al menos 8 caracteres.";

    if (!/\d/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos un número
      error = "Un número.";

    if (!/[a-zA-Z]/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos una letra
      error = "Una letra.";

    /*
    if (!/\W/.test(contrasena.value))
      // Validamos si la contraseña contiene al menos un carácter especial
      error = "Un carácter especial.";
    */

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
export const validarCampo = (event) => {
  const campo = event.target;
  const tipo = campo.dataset.validate;
  let resultado = { valid: true };

  // Si no pasa la validación personalizada o está vacío
  const vacio =
    (campo.tagName === "INPUT" && campo.value.trim() === "") ||
    (campo.tagName === "SELECT" && campo.selectedIndex === 0);

  if (vacio) {
    agregarError(campo.parentElement, "El campo es obligatorio.");
    return false;
  }

  if (tipo && validadoresInput[tipo]) {
    resultado = validadoresInput[tipo](event);
  }

  if (!resultado.valid) {
    agregarError(campo.parentElement, resultado.message);
    return false;
  }

  quitarError(campo.parentElement);
  return true;
};

export const configurarValidaciones = (formulario) => {
  const campos = [...formulario].filter(
    (elemento) =>
      elemento.hasAttribute("required") &&
      (elemento.tagName == "INPUT" || elemento.tagName == "SELECT")
  );

  campos.forEach((campo) => {
    campo.addEventListener("blur", validarCampo);
    campo.addEventListener("keydown", validarCampo);
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
  // Puedes seguir agregando más tipos según crezcas
};

export const validarCampos = (event) => {
  let valido = true;
  const campos = [...event.target].filter(
    (elemento) =>
      elemento.hasAttribute("required") &&
      (elemento.tagName == "INPUT" || elemento.tagName == "SELECT")
  );

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

// Entonces lo que tengo que hacer en general es una función que reciba el formulario, que obtenga los campos, y que valide cada uno. Se va a hacer dinámicamente gracias al dataset que se llama Data Validate.

// Tendría que hacer una función para el evento KeyDown. Entonces tengo que hacer una función solamente para eliminar la letra no permitida. Para que no entre en conflicto con el evento Blur y Input.

// Para el evento Blur e Input haría una función que valide la cadena completa, que está correcta, si está correcta.

// Esa función se tiene que hacer porque el KeyDown no me actualiza de una vez si hay error o no cuando ingreso la letra porque no toma la tecla ingresada por el evento KeyDown.

//También toca hacer una función que agregue los eventos de los campos, eventos como Blur, KeyDown y Input, que los tiene que agregar al controlador directamente, ya que no los podemos hacer en validarCampos, ya que solamente se ejecutaría cuando se envía el formulario.
