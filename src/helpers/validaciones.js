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
  const valor = event.target.value;

  if (valor.length > limite) {
    event.target.value = valor.slice(0, limite);
    return { valid: false, message: `Máx. ${limite} caracteres` };
  }

  return { valid: true };
};

export const validarTexto = (event) => {
  const regex = /[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]/g;
  const limpio = event.target.value.replace(regex, "");

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo letras" };
  }

  return { valid: true };
};

export const validarAlfanumericos = (event) => {
  const regex = /[^\w_.]/g;
  const limpio = event.target.value.replace(regex, "");

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo alfanumérico" };
  }

  return { valid: true };
};

export const validarNumero = (event) => {
  const regex = /[^\d]/g;
  const limpio = event.target.value.replace(regex, "");

  if (limpio !== event.target.value) {
    event.target.value = limpio;
    return { valid: false, message: "Solo números" };
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
  const campo = event.target;
  const tipo = campo.dataset.validate;
  // const eventoActual = event.type;

  const esRequerido = campo.hasAttribute("required");
  const valor = campo.value.trim();
  const vacioInput =
    (campo.tagName === "INPUT" || campo.tagName === "TEXTAREA") && valor === "";
  const vacioSelect = campo.tagName === "SELECT" && campo.selectedIndex === 0;

  // Si el campo es requerido y está vacío, mostramos el error de obligatorio
  if (esRequerido && (vacioInput || vacioSelect)) {
    agregarError(campo.parentElement, "El campo es obligatorio.");
    return false;
  }

  // Si el campo no es requerido y está vacío, entonces es válido (no validamos nada más)
  if (!esRequerido && valor === "") {
    quitarError(campo.parentElement);
    return true;
  }

  // Si tiene validaciones específicas, las aplicamos
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
          console.log("resultado.message", resultado.message);
          console.log("campo.parentElement", campo.parentElement);

          return false;
        }
      }
    }
  }

  // Si pasó todas las validaciones, quitamos errores
  quitarError(campo.parentElement);
  return true;
};

export const configurarEventosValidaciones = (formulario) => {
  const requeridos = obtenerCamposValidables(formulario); // Campos con atributo required
  const opcionales = obtenerCamposOpcionales(formulario); // Campos sin required pero con data-validate
  const campos = [...requeridos, ...opcionales]; // Unimos ambos grupos

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

// Esta función obtiene los campos que no son requeridos pero tienen validaciones específicas definidas en data-validate
const obtenerCamposOpcionales = (formulario) => {
  return [...formulario].filter(
    (elemento) =>
      !elemento.hasAttribute("required") &&
      !elemento.parentElement.classList.contains("hidden") &&
      (elemento.tagName === "INPUT" || elemento.tagName === "SELECT") &&
      elemento.dataset.validate // Solo campos con data-validate
  );
};

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

export const validarCampos = (event) => {
  let valido = true;

  const requeridos = obtenerCamposValidables(event.target); // Campos con required
  const opcionales = obtenerCamposOpcionales(event.target); // Campos sin required pero con data-validate
  const campos = [...requeridos, ...opcionales]; // Unimos ambos para procesarlos

  campos.forEach((campo) => {
    // Validamos los campos requeridos normalmente
    if (campo.hasAttribute("required")) {
      if (!validarCampo({ target: campo })) valido = false;
    } else {
      // Para campos no requeridos:
      // Solo se valida si el usuario escribió algo.
      // Si está vacío, no se valida porque no es obligatorio.
      // Pero si tiene contenido, se valida su formato.
      if (campo.value.trim() !== "") {
        if (!validarCampo({ target: campo })) valido = false;
      }
    }

    const valor = campo.value.trim();

    // Guardamos en el objeto datos, convirtiendo números si es necesario
    datos[campo.getAttribute("name")] = /^\d+$/.test(valor)
      ? parseInt(valor)
      : valor;
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
