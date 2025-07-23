import { router } from "./router/router";
import "./styles/style.css";
import "remixicon/fonts/remixicon.css";

window.addEventListener("DOMContentLoaded", router);

window.addEventListener("hashchange", router);
