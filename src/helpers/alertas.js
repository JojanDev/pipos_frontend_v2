import Swal from "sweetalert2";

/**
 * Muestra un modal de éxito con título predefinido.
 *
 * @param {string} message - Mensaje a mostrar dentro del modal.
 * @returns {Promise<SweetAlertResult>}
 *   Promise que se resuelve cuando el usuario cierra el modal.
 *
 */
export const success = (message) => {
  return Swal.fire({
    title: "Exito!",
    text: message,
    icon: "success",
    draggable: true,
  });
};

/**
 * Muestra un toast temporal de éxito en la esquina superior.
 *
 * @param {string} message - Mensaje breve a mostrar en el toast.
 * @returns {Promise<SweetAlertToastResult>}
 *   Promise que se resuelve cuando expira el timer o el usuario interactúa.
 *
 */
export const successTemporal = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    width: "auto",
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  return Toast.fire({
    icon: "success",
    title: message,
  });
};

/**
 * Muestra un toast temporal de advertencia en la esquina superior.
 *
 * @param {string} message - Mensaje breve a mostrar en el toast de advertencia.
 * @returns {Promise<SweetAlertToastResult>}
 *   Promise que se resuelve tras expirar el timer o tras interacción del usuario.
 *
 */
export const errorTemporal = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    width: "auto",
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  return Toast.fire({
    icon: "warning",
    title: message,
  });
};

/**
 * Muestra un modal de error con título y confirmación.
 *
 * @param {string} message - Texto descriptivo del error.
 * @returns {Promise<SweetAlertResult>}
 *   Promise que se resuelve cuando el usuario presiona "Ok".
 *
 */
export const error = (message) => {
  return Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
    confirmButtonText: "Ok",
  });
};

/**
 * Muestra un modal de "Inicio de sesión" con spinner y timer.
 *
 * @param {string} message - Mensaje HTML o texto a mostrar durante la carga.
 * @returns {Promise<SweetAlertResult>}
 *   Promise que se resuelve cuando finaliza el timer (2000ms).
 *
 */
export const loginSuccess = (message) => {
  return Swal.fire({
    title: "Inicio de sesión",
    html: message,
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {},
  });
};

/**
 * Muestra un modal de confirmación antes de eliminar o continuar.
 *
 * @returns {Promise<SweetAlertResult>}
 *   Promise que se resuelve con la respuesta del usuario (confirmado o cancelado).
 *
 */
export const confirm = () => {
  return Swal.fire({
    title: "Precaución",
    text: "¿Está seguro de eliminar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí",
  });
};
