import {
  loginController,
  registerController,
  homeController,
} from "../views/index";
import mainLayout from "../layouts/mainLayout.html?raw";

export const routes = {
  inicio: {
    path: "home/index.html",
    controller: homeController,
    private: true,
    layout: mainLayout,
    slot: "main",
  },
  login: {
    path: "auth/login/index.html",
    controller: loginController,
    private: false,
  },
  registro: {
    path: "auth/register/index.html",
    controller: registerController,
    private: false,
  },
};
