import {
  loginController,
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
  createProductTypeController,
  createBreedController,
  createSpecieController,
  profileSpecieController,
  editSpecieController,
  profileProductTypeController,
  editProductTypeController,
  createServiceController,
  servicesController,
  administrationController,
  editBreedController,
  profileBreedController,
  editServiceController,
  createMedicamentInventoryController,
  createMedicamentInfoController,
  editMedicamentInfoController,
  medicamentsController,
  personalController,
  createPersonalController,
  createPersonalExistController,
  profilePersonalController,
  editPersonalController,
  editClientController,
  createClienteExistController,
  resumeController,
  createDetailsController,
  createVentaController,
  ventasController,
  editVentaController,
  editMedicamentInventoryController,
  profileVentaController,
  editPetController,
  editAntecedentController,
  editTreatmentController,
  editMedicamentTreatmentController,
  editProductController,
  profileMedicamentInfoController,
} from "../views/index";

export const routes = {
  inicio: {
    path: "home/index.html",
    controller: homeController,
    private: true,
    needLayout: true,
    slot: "main",
  },
  clientes: {
    "/": {
      path: "clients/index.html",
      controller: clientsController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    crear: {
      path: "clients/create/index.html",
      controller: createClientController,
      private: true,
      addHtml: true,
    },
    crearExistente: {
      path: "clients/createExist/index.html",
      controller: createClienteExistController,
      private: true,
      addHtml: true,
    },
    perfil: {
      "/": {
        path: "clients/profile/index.html",
        controller: profileClientController,
        private: true,
        addHtml: true,
      },
      editar: {
        path: "clients/edit/index.html",
        controller: editClientController,
        private: true,
        addHtml: true,
      },
      mascotas: {
        crear: {
          path: "pets/create/index.html",
          controller: createPetController,
          private: true,
          addHtml: true,
        },
      },
    },
  },
  mascotas: {
    "/": {
      path: "pets/index.html",
      controller: petsController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    crear: {
      path: "pets/create/index.html",
      controller: createPetController,
      private: true,
      addHtml: true,
    },
    perfil: {
      "/": {
        path: "pets/profile/index.html",
        controller: profilePetController,
        private: true,
        needLayout: true,
        slot: "main",
      },
      editar: {
        path: "pets/edit/index.html",
        controller: editPetController,
        private: true,
        addHtml: true,
      },
      antecedente: {
        crear: {
          path: "antecedent/create/index.html",
          controller: createAntecedentController,
          private: true,
          addHtml: true,
        },
        editar: {
          path: "antecedent/edit/index.html",
          controller: editAntecedentController,
          private: true,
          addHtml: true,
        },
        tratamiento: {
          perfil: {
            "/": {
              path: "antecedent/treatment/index.html",
              controller: treatmentController,
              private: true,
              addHtml: true,
            },
            editar: {
              path: "antecedent/treatment/edit/index.html",
              controller: editTreatmentController,
              private: true,
              addHtml: true,
            },
            medicamento: {
              crear: {
                path: "antecedent/treatment/medicament/create/index.html",
                controller: createMedicamentController,
                private: true,
                addHtml: true,
              },
              editar: {
                path: "antecedent/treatment/medicament/edit/index.html",
                controller: editMedicamentTreatmentController,
                private: true,
                addHtml: true,
              },
            },
          },
          crear: {
            path: "antecedent/treatment/create/index.html",
            controller: createTreatmentController,
            private: true,
            addHtml: true,
          },
        },
      },
    },
  },

  "administrar-datos": {
    "/": {
      path: "administration/index.html",
      controller: administrationController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    especies: {
      razas: {
        crear: {
          path: "administration/breeds/create/index.html",
          controller: createBreedController,
          private: true,
          addHtml: true,
        },
        perfil: {
          "/": {
            path: "administration/breeds/profile/index.html",
            controller: profileBreedController,
            private: true,
            addHtml: true,
          },
          editar: {
            path: "administration/breeds/edit/index.html",
            controller: editBreedController,
            private: true,
            addHtml: true,
          },
        },
      },
      crear: {
        path: "administration/species/create/index.html",
        controller: createSpecieController,
        private: true,
        addHtml: true,
      },
      perfil: {
        "/": {
          path: "administration/species/profile/index.html",
          controller: profileSpecieController,
          private: true,
          addHtml: true,
        },
        editar: {
          path: "administration/species/edit/index.html",
          controller: editSpecieController,
          private: true,
          addHtml: true,
        },
      },
    },
    // razas: {
    //   perfil: {
    //     "/": {
    //       path: "administration/breeds/profile/index.html",
    //       controller: profileBreedController,
    //       private: true,
    //       addHtml: true,
    //     },
    //     editar: {
    //       path: "administration/breeds/edit/index.html",
    //       controller: editBreedController,
    //       private: true,
    //       addHtml: true,
    //     },
    //   },
    // },
    "tipos-productos": {
      crear: {
        path: "administration/productsTypes/create/index.html",
        controller: createProductTypeController,
        private: true,
        addHtml: true,
      },
      perfil: {
        "/": {
          path: "administration/productsTypes/profile/index.html",
          controller: profileProductTypeController,
          private: true,
          addHtml: true,
        },
        editar: {
          path: "administration/productsTypes/edit/index.html",
          controller: editProductTypeController,
          private: true,
          addHtml: true,
        },
      },
    },
  },
  servicios: {
    "/": {
      path: "services/index.html",
      controller: servicesController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    crear: {
      path: "services/create/index.html",
      controller: createServiceController,
      private: true,
      addHtml: true,
    },
    editar: {
      path: "services/edit/index.html",
      controller: editServiceController,
      private: true,
      addHtml: true,
    },
  },
  inventario: {
    "/": {
      path: "inventory/index.html",
      controller: inventoryController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    productos: {
      crear: {
        path: "inventory/products/create/index.html",
        controller: createProductController,
        private: true,
        addHtml: true,
      },
      editar: {
        path: "inventory/products/edit/index.html",
        controller: editProductController,
        private: true,
        addHtml: true,
      },
    },
    medicamentos: {
      crear: {
        "/": {
          path: "inventory/medicaments/create/index.html",
          controller: createMedicamentInventoryController,
          private: true,
          addHtml: true,
        },
        "info-medicamentos": {
          crear: {
            path: "medicaments/create/index.html",
            controller: createMedicamentInfoController,
            private: true,
            addHtml: true,
          },
        },
      },
      editar: {
        path: "inventory/medicaments/edit/index.html",
        controller: editMedicamentInventoryController,
        private: true,
        addHtml: true,
      },
    },
  },
  "info-medicamentos": {
    "/": {
      path: "medicaments/index.html",
      controller: medicamentsController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    crear: {
      path: "medicaments/create/index.html",
      controller: createMedicamentInfoController,
      private: true,
      addHtml: true,
    },
    perfil: {
      "/": {
        path: "medicaments/profile/index.html",
        controller: profileMedicamentInfoController,
        private: true,
        addHtml: true,
      },
      editar: {
        path: "medicaments/edit/index.html",
        controller: editMedicamentInfoController,
        private: true,
        addHtml: true,
      },
    },
  },
  login: {
    path: "auth/login/index.html",
    controller: loginController,
    private: false,
  },
  usuarios: {
    "/": {
      path: "personal/index.html",
      controller: personalController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    crear: {
      path: "personal/create/index.html",
      controller: createPersonalController,
      private: false,
      needLayout: true,
      slot: "main",
    },
    crearExistente: {
      path: "personal/createExist/index.html",
      controller: createPersonalExistController,
      private: false,
      addHtml: true,
    },
    perfil: {
      "/": {
        path: "personal/profile/index.html",
        controller: profilePersonalController,
        private: true,
        addHtml: true,
      },
      editar: {
        path: "personal/edit/index.html",
        controller: editPersonalController,
        private: true,
        addHtml: true,
      },
    },
  },

  ventas: {
    "/": {
      path: "ventas/index.html",
      controller: ventasController,
      private: true,
      needLayout: true,
      slot: "main",
    },
    crear: {
      "/": {
        path: "ventas/create/index.html",
        controller: createVentaController,
        private: false,
        needLayout: true,
        slot: "main",
      },
      "agregar-elemento": {
        path: "ventas/details/create/index.html",
        controller: createDetailsController,
        private: false,
        // needLayout: true,
        // slot: "main",
        addHtml: true,
      },
      finalizar: {
        path: "ventas/resume/index.html",
        controller: resumeController,
        private: true,
        addHtml: true,
      },
    },
    perfil: {
      "/": {
        path: "ventas/profile/index.html",
        controller: profileVentaController,
        private: true,
        addHtml: true,
      },
      editar: {
        path: "ventas/edit/index.html",
        controller: editVentaController,
        private: true,
        addHtml: true,
      },
    },
  },
};
