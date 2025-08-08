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
  console.log("cerrarModalYVolverAVistaBase");

  const vistaBase = obtenerVistaBase();
  if (!vistaBase) return;

  const rutaBaseHash = vistaBase.split("/")[0];
  console.log("rutaBaseHash", rutaBaseHash);

  const modal = document.querySelector(".modal__backdrop");
  if (modal) {
    modal.remove();
    history.replaceState(null, "", `#/${rutaBaseHash}`);
  }
}

export const cerrarModal = (modalKey) => {
  console.log("cerrarModal");

  const modal = document.querySelector(`[data-modal="${modalKey}"]`);
  if (!modal) return;

  // Si quieres añadir animación de salida, puedes hacerlo aquí:
  // modal.classList.add("modal--closing");

  // Y usar timeout si es necesario:
  // setTimeout(() => modal.remove(), 200);

  modal.remove();
};
