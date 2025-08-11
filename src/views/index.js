// =========================
// AUTENTICACIÓN
// =========================
export * from "./auth/login/loginController.js";

// =========================
// HOME
// =========================
export * from "./home/homeController.js";

// =========================
// CLIENTES
// =========================
export * from "./clients/clientsController.js";
export * from "./clients/create/createController.js";
export * from "./clients/profile/profileController.js";
export * from "./clients/edit/editController.js";
export * from "./clients/createExist/createExistController.js";

// =========================
// MASCOTAS
// =========================
export * from "./pets/petsController.js";
export * from "./pets/create/createController.js";
export * from "./pets/profile/profileController.js";

// =========================
// ANTECEDENTES
// =========================
export * from "./antecedent/create/createController.js";

// ----- Tratamientos -----
export * from "./antecedent/treatment/treatmentController.js";
export * from "./antecedent/treatment/create/createController.js";
export * from "./antecedent/treatment/medicament/create/createController.js";

// =========================
// INVENTARIO
// =========================
export * from "./inventory/inventoryController.js";

// ----- Productos -----
export * from "./inventory/products/create/createController.js";

// ----- Medicamentos -----
export * from "./inventory/medicaments/create/createController.js";
export * from "./inventory/medicaments/profile/profileController.js";

// =========================
// MEDICAMENTOS (módulo principal, fuera de inventario)
// =========================
export * from "./medicaments/create/createController.js";
export * from "./medicaments/edit/editController.js";
export * from "./medicaments/medicamentsController.js";

// =========================
// ADMINISTRACIÓN
// =========================
export * from "./administration/administrationController.js";

// ----- Razas -----
export * from "./administration/breeds/create/createController.js";
export * from "./administration/breeds/edit/editController";
export * from "./administration/breeds/profile/profileController";

// ----- Especies -----
export * from "./administration/species/create/createController.js";
export * from "./administration/species/edit/editController.js";
export * from "./administration/species/profile/profileController.js";

// ----- Tipos de productos -----
export * from "./administration/productsTypes/create/createController.js";
export * from "./administration/productsTypes/edit/editController.js";
export * from "./administration/productsTypes/profile/profileController.js";

// =========================
// SERVICIOS
// =========================
export * from "./services/servicesController.js";
export * from "./services/create/createController.js";
export * from "./services/edit/editController.js";

// =========================
// PERSONAL
// =========================
export * from "./personal/personalController.js";
export * from "./personal/create/createController.js";
export * from "./personal/createExist/createExistController.js";
export * from "./personal/profile/profileController.js";
export * from "./personal/edit/editController.js";

// =========================
// VENTAS
// =========================
export * from "./ventas/details/create/createController.js";
export * from "./ventas/resume/resumeController.js";
export * from "./ventas/create/createController.js";
export * from "./ventas/ventaController.js";
export * from "./ventas/edit/editController.js";
