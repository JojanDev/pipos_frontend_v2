import Swal from "sweetalert2";

export const success = (message) => {
  return Swal.fire({
    title: message,
    icon: "success",
    draggable: true,
  });
};

export const error = (message) => {
  return Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
    confirmButtonText: "Ok",
  });
};

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
