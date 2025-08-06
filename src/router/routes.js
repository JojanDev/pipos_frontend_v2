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
  createTreatmentController,
  createMedicamentController,
  inventoryController,
  createProductController,
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
      path: "antecedent/create/index.html",
      controller: createAntecedentController,
      private: true,
      addHtml: true,
    },
    tratamiento: {
      path: "antecedent/treatment/index.html",
      controller: treatmentController,
      private: true,
      addHtml: true,
    },
    tratamientoCrear: {
      path: "antecedent/treatment/create/index.html",
      controller: createTreatmentController,
      private: true,
      addHtml: true,
    },
    medicamento: {
      path: "antecedent/treatment/medicament/create/index.html",
      controller: createMedicamentController,
      private: true,
      addHtml: true,
    },
  },
  inventario: {
    "/": {
      path: "inventory/index.html",
      controller: inventoryController,
      private: true,
      layout: "mainLayout.html",
      slot: "main",
    },
  },
  productos: {
    crear: {
      path: "inventory/products/create/index.html",
      controller: createProductController,
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
