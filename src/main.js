// import { get } from "./helpers";
import { layoutController } from "./layouts/layout";
import { router } from "./router/router";
import "./styles/style.css";
import "remixicon/fonts/remixicon.css";

window.addEventListener("DOMContentLoaded", async () => {
  await router();
  await layoutController();
});

window.addEventListener("hashchange", async () => {
  await router();
  await layoutController();
});
