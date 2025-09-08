// Detecta el slot activo con data-vista-base y devuelve su ruta base
export function obtenerVistaBase() {
  const slots = document.querySelectorAll("[data-slot]");
  for (const slot of slots) {
    const vistaBase = slot.getAttribute("data-vista-base");
    if (vistaBase) return vistaBase;
  }
  return null;
}

// Cierra el modal y redirige al hash correspondiente a la vista base
export function cerrarModalYVolverAVistaBase() {
  const vistaBase = obtenerVistaBase();
  if (!vistaBase) return;

  const rutaBaseHash = vistaBase.split("/")[0];

  const modal = document.querySelector(".modal__backdrop");
  if (modal) {
    modal.remove();
    history.replaceState(null, "", `#/${rutaBaseHash}`);
  }
}

export const cerrarModal = (modalKey) => {
  const modal = document.querySelector(`[data-modal="${modalKey}"]`);
  if (!modal) return;

  modal.remove();
};

export const configurarBotonCerrar = (buttonId, esModal) => {
  const button = document.querySelector(`#${buttonId}`);
  if (!button) return;

  button.addEventListener("click", () => {
    const modalId = button.dataset.modal;
    cerrarModal(modalId);
    history.back();
  });
};
