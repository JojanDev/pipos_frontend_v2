import {
  loginController,
  registerController,
  homeController,
  clientsController,
  createController,
  profileController,
} from "../views/index";

export const routes = {
  inicio: {
    path: "home/index.html",
    controller: homeController,
    private: true,
    layout: "mainLayout.html",
    slot: "main",
  },
  clientes: {
    "/": {
      path: "clients/index.html",
      controller: clientsController,
      private: true,
      layout: "mainLayout.html",
      slot: "main",
    },
    crear: {
      path: "clients/create/index.html",
      controller: createController,
      private: true,
      addHtml: true,
    },
    perfil: {
      path: "clients/profile/index.html",
      controller: profileController,
      private: true,
      addHtml: true,
    },
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
