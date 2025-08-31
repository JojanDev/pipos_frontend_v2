import Swal from "sweetalert2";

export const success = (message) => {
  return Swal.fire({
    title: "Exito!",
    text: message,
    icon: "success",
    draggable: true,
  });
};

export const successTemporal = (message) => {
  // return Swal.fire({
  //   icon: "success",
  //   title: "Exito!",
  //   text: message,
  //   showConfirmButton: false,
  //   timer: 2000,
  //   timerProgressBar: true,
  // });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 4000,
    width: "auto",
    color: "#0161b5",
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

export const errorTemporal = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 4000,
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
