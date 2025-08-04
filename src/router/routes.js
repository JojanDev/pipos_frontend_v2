import {
  loginController,
  registerController,
  homeController,
  clientsController,
  createClientController,
  profileClientController,
  createPetController,
  petsController,
  profilePetController,
  treatmentController,
  createAntecedentController,
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
      controller: createClientController,
      private: true,
      addHtml: true,
    },
    perfil: {
      path: "clients/profile/index.html",
      controller: profileClientController,
      private: true,
      addHtml: true,
    },
  },
  mascotas: {
    "/": {
      path: "pets/index.html",
      controller: petsController,
      private: true,
      layout: "mainLayout.html",
      slot: "main",
    },
    crear: {
      path: "pets/create/index.html",
      controller: createPetController,
      private: true,
      addHtml: true,
    },
    perfil: {
      path: "pets/profile/index.html",
      controller: profilePetController,
      private: true,
      layout: "mainLayout.html",
      slot: "main",
    },
  },
  antecedente: {
    crear: {
      path: "pets/antecedent/create/index.html",
      controller: createAntecedentController,
      private: true,
      addHtml: true,
    },
    tratamiento: {
      path: "pets/antecedent/treatment/index.html",
      controller: treatmentController,
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
