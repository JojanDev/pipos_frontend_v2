export const layoutController = () => {
  const dataJSON = localStorage.getItem("data");
  const data = JSON.parse(dataJSON);
  console.log(data);

  const nombreEmpleado = document.querySelector("#empleado-nombre-header");
  nombreEmpleado.textContent = data.usuario;

  if (data.id_rol == 2) {
    const opcionesAdmin = document.querySelectorAll(".admin");
    [...opcionesAdmin].forEach((element) => {
      element.remove();
    });
  }

  const btnCuenta = document.querySelector("#cuenta");
  console.log(btnCuenta);

  btnCuenta?.addEventListener("click", (e) => {
    const btnOpciones = document.querySelector(".cuenta-opciones");
    console.log(btnOpciones);

    if (btnOpciones.classList.contains("cuenta-hidden")) {
      btnOpciones.classList.remove("cuenta-hidden");
    } else {
      btnOpciones.classList.add("cuenta-hidden");
    }
  });

  const layout = document.querySelector(".layout");

  layout.addEventListener("click", (e) => {
    if (e.target.id == "perfil-usuario") {
      // window.location.hash = "#/personal/";
    }
    console.log("SI");

    if (e.target.id == "salir-usuario") {
      console.log("SI");

      localStorage.clear();
      window.location.hash = "#/login/";
    }
  });
};
