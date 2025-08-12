// import { get } from "./helpers";
import { layoutController } from "./layouts/layout";
import { router } from "./router/router";
import "./styles/style.css";
import "remixicon/fonts/remixicon.css";

window.addEventListener("DOMContentLoaded", async () => {
  await router();
  await layoutController();
  // console.log("DOM CONTENT LOAD");
  
  // const dataJSON = localStorage.getItem("data");
  // const dataINFO = JSON.parse(dataJSON);
  // console.log(dataINFO);

  // const cliente = await (await fetch("personal/" + dataINFO.id)).json();
  // console.log(cliente);

  // const nombreEmpleado = document.querySelector("#empleado-nombre-header");
  // nombreEmpleado.textContent = cliente.usuario;
});

window.addEventListener("hashchange", async () => {
  await router();
  // await layoutController();
  console.log("HASH GHACNE");

});
